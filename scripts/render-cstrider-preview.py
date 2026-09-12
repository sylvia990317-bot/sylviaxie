"""Render an isolated CSTRIDER review copy; never save over FinalModel.blend.

Run with Blender --background --disable-autoexec FinalModel.blend --python this_file.
Uses the supplied UI screenshots, preserves workstation geometry, and replaces missing
environment/floor/plant resources with explicit review materials.
"""
import bpy
import json
import zipfile
import sys
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "design-source" / "cstrider-source"
OUT = SOURCE / "render-review"
OUT.mkdir(parents=True, exist_ok=True)
scene = bpy.context.scene
if bpy.context.object and bpy.context.object.mode != "OBJECT":
    bpy.ops.object.mode_set(mode="OBJECT")
changes = []

def simple_material(material, color, roughness=0.6, metallic=0.0):
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.inputs["Base Color"].default_value = (*color, 1)
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    output = nodes.new("ShaderNodeOutputMaterial")
    material.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return shader

# Restore image references before rendering so missing files cannot create magenta UI.
image_map = {
    "ferry1.png": SOURCE / "screen 1.png",
    "ferry2.png": SOURCE / "screen 2.png",
    "ferry3.png": SOURCE / "screen 3.png",
    "left.png": SOURCE / "middle.png",
    "middle.png": SOURCE / "right screen.png",
}
for name, path in image_map.items():
    if not path.is_file():
        raise FileNotFoundError(path)
    old = bpy.data.images.get(name)
    if old:
        old.filepath = str(path)
        old.reload()
        old.pack()
        changes.append("Relinked " + name + " to " + path.name)

# The shared wall is the deck's external traffic-system placeholder, not a new UI.
wall_texture = OUT / "external-traffic-placeholder.png"
with zipfile.ZipFile(SOURCE / "portfolio cstrider.pptx") as deck:
    wall_texture.write_bytes(deck.read("ppt/media/image10.png"))
wall_image = bpy.data.images.load(str(wall_texture), check_existing=True)
wall_image.pack()
wall_material = bpy.data.materials["big.middle.screen"]
for node in wall_material.node_tree.nodes:
    if node.type == "TEX_IMAGE":
        node.image = wall_image

# Keep existing UVs, use an emissive surface so illumination cannot erase the UI.
for material in bpy.data.materials:
    if material.name.startswith(("smallscreen.middle.", "middle screen")) or material == wall_material:
        image_node = next((n for n in material.node_tree.nodes if n.type == "TEX_IMAGE" and n.image), None)
        if image_node and image_node.image.size[0] > 0:
            output = next(n for n in material.node_tree.nodes if n.type == "OUTPUT_MATERIAL")
            emission = material.node_tree.nodes.new("ShaderNodeEmission")
            # AgX compresses a unit-strength UI texture to grey. Give displays their
            # own luminance and contrast adjustment without changing room exposure.
            emission.inputs["Strength"].default_value = 2.5
            gamma = material.node_tree.nodes.new("ShaderNodeGamma")
            gamma.inputs["Gamma"].default_value = 1.25
            material.node_tree.links.new(image_node.outputs["Color"], gamma.inputs["Color"])
            material.node_tree.links.new(gamma.outputs["Color"], emission.inputs["Color"])
            material.node_tree.links.new(emission.outputs[0], output.inputs["Surface"])
changes.append("Increased display emission to 2.5 and adjusted display-only gamma to 1.25 to counter grey UI under AgX")

# Missing decorative textures are replaced only in the review copy.
for material in bpy.data.materials:
    if material.name.startswith("PlantMonsteraVase"):
        simple_material(material, (0.63, 0.61, 0.56), 0.8)
    elif material.name.startswith("PlantMonstera"):
        simple_material(material, (0.055, 0.15, 0.055), 0.55)
    elif material.name in {"Poliigon_WoodVeneerOak_7760_2K", "floor.001"}:
        shader = simple_material(material, (0.42, 0.29, 0.17), 0.58)
        packed_wood = bpy.data.images.get("plywood_diff_4k.jpg")
        if packed_wood:
            texture = material.node_tree.nodes.new("ShaderNodeTexImage")
            texture.image = packed_wood
            material.node_tree.links.new(texture.outputs["Color"], shader.inputs["Base Color"])
    elif material.name in {"Material.001", "Material.010"}:
        # Tablet UI was not supplied; use a powered-off display instead of inventing it.
        simple_material(material, (0.012, 0.016, 0.021), 0.28)

# Replace the mottled leather colour maps with consistent black upholstery.
# Keep the chair geometry and separate plastic/chrome materials intact.
for material in bpy.data.materials:
    if material.name.startswith("couro 2 4k"):
        shader = simple_material(material, (0.002, 0.002, 0.002), 0.72)
        shader.inputs["Specular IOR Level"].default_value = 0.12
changes.append("Chair upholstery changed to black with soft highlights; mottled leather maps removed")
plant = bpy.data.objects.get("PlantMonstera001_2K_Empty")
if plant:
    for obj in [plant, *plant.children_recursive]:
        obj.hide_render = True
    changes.append("Removed foreground plant from the render at Sylvia's request")

wall = bpy.data.materials.get("Material")
if wall:
    simple_material(wall, (0.72, 0.73, 0.71), 0.85)
if bpy.data.objects.get("Man"):
    bpy.data.objects["Man"].hide_render = True

# Hide only the unused legacy single-view screen, leaving six actual vessel screens.
legacy = bpy.data.objects.get("Cube.017")
if legacy:
    legacy.hide_render = True

world = bpy.data.worlds.new("CSTRIDER review daylight")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.70, 0.79, 1.0, 1)
world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.25
scene.world = world
for obj in scene.objects:
    if obj.type == "LIGHT":
        obj.hide_render = True

def area(name, location, target, power, size, color):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.shape = "DISK"
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()

# Horizontal emitters stay entirely below the ceiling; tilted large disks used to
# intersect it and leave abrupt lighting boundaries across the otherwise flat plane.
area("Review window key", (-1.5, -0.65, 2.10), (-1.5, -0.65, 0), 240, 2.3, (1.0, 0.97, 0.93))
area("Review window fill", (1.75, -0.65, 2.10), (1.75, -0.65, 0), 170, 1.8, (0.95, 0.98, 1.0))
area("Review ceiling bounce", (0, -1.3, 1.85), (0, -1.3, 2.2), 45, 3.5, (1.0, 1.0, 1.0))
changes.append("Kept ceiling lights below the roof plane and added broad upward fill for even ceiling illumination")

scene.camera = bpy.data.objects["Camera"]
for obj in scene.objects:
    if obj.name.startswith("win_doubleShort"):
        obj.hide_render = True
# Extend a plain ceiling over the virtual camera so the frame reads as an interior.
ceiling_material = bpy.data.materials.new("Review matte white ceiling")
ceiling_shader = simple_material(ceiling_material, (0.78, 0.78, 0.78), 1.0)
ceiling_shader.inputs["Specular IOR Level"].default_value = 0
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, -2.25, 2.20))
ceiling = bpy.context.object
ceiling.name = "Review ceiling"
ceiling.scale = (6, 3.75, 1)
ceiling.data.materials.append(ceiling_material)
changes.append("Added a matte ceiling over the virtual camera and lowered viewpoint for an interior photograph composition")
scene.camera.location = (0, -5.0, 1.70)
scene.camera.rotation_euler = (Vector((0, 0.65, 1.10)) - scene.camera.location).to_track_quat("-Z", "Y").to_euler()
scene.camera.data.lens = 32
scene.camera.data.dof.use_dof = False
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.render.threads_mode = "FIXED"
scene.render.threads = 8
scene.render.resolution_x = 960
scene.render.resolution_y = 540
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = False
scene.render.use_simplify = True
scene.render.simplify_subdivision_render = 1
scene.view_settings.view_transform = "AgX"
scene.view_settings.exposure = 0.3
scene.render.filepath = str(OUT / "cstrider-interior-black-preview-v2.png")

report = {
    "source": "public/maritime-hmi/FinalModel.blend",
    "changes": changes + ["Front window assemblies hidden for cutaway view", "Camera reframed to show both workstations"],
    "review_only": ["Original geometry retained", "White mannequin hidden", "Tablet displays off: missing source", "External traffic placeholder from PPT", "Plant/floor materials substituted", "Right workstation reuses supplied ferry 1–3 screenshots"],
    "render": {"size": [960, 540], "samples": 24, "engine": "Cycles CPU", "threads": 8},
}
if "--prepare-only" not in sys.argv:
    (OUT / "render-notes.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "CSTRIDER-review.blend"), compress=True)
    print("REVIEW_RENDER_START", flush=True)
    bpy.ops.render.render(write_still=True)
    print("REVIEW_RENDER_DONE", scene.render.filepath, flush=True)
