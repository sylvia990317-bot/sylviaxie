"""Build a generic canal setting around the supplied ROC, in a separate review copy."""
import bpy
import json
import math
import random
import runpy
import sys
from pathlib import Path
from mathutils import Vector

sys.argv.append("--prepare-only")
base = runpy.run_path(str(Path(__file__).with_name("render-cstrider-preview.py")))
scene, OUT = base["scene"], base["OUT"]
simple_material, area = base["simple_material"], base["area"]
rng = random.Random(19)
draft = "--draft" in sys.argv
station_only = "--station-only" in sys.argv
wide_only = "--wide-only" in sys.argv

def material(name, color, roughness=0.6, metallic=0):
    mat = bpy.data.materials.new(name)
    simple_material(mat, color, roughness, metallic)
    return mat

def box(name, location, scale, mat, bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Soft manufactured edges", "BEVEL")
        mod.width, mod.segments = bevel, 2
    return obj

# The existing angled rear panels are the room's actual window surfaces.
glass = bpy.data.materials["glass"]
glass.node_tree.nodes.clear()
nodes, links = glass.node_tree.nodes, glass.node_tree.links
clear = nodes.new("ShaderNodeBsdfTransparent")
reflect = nodes.new("ShaderNodeBsdfGlass")
reflect.inputs["IOR"].default_value = 1.45
reflect.inputs["Roughness"].default_value = 0.025
mix = nodes.new("ShaderNodeMixShader")
mix.inputs[0].default_value = 0.08
links.new(clear.outputs[0], mix.inputs[1])
links.new(reflect.outputs[0], mix.inputs[2])
output = nodes.new("ShaderNodeOutputMaterial")
links.new(mix.outputs[0], output.inputs["Surface"])

frame = material("Canal window graphite frame", (0.07, 0.08, 0.085), 0.42, 0.3)
room = bpy.data.objects["Cube.010"]
for face in room.data.polygons:
    if face.material_index != 1:
        continue
    points = [room.matrix_world @ room.data.vertices[i].co for i in face.vertices]
    for a, b in zip(points, points[1:] + points[:1]):
        edge = box("Rear window perimeter", (a+b)/2, (0.035, 0.035, (b-a).length), frame)
        edge.rotation_euler = (b-a).to_track_quat("Z", "Y").to_euler()

# Keep water below the ROC floor and place the opposite embankment across a canal.
water = material("Canal blue green water", (0.012, 0.075, 0.09), 0.28, 0.05)
shader = next(n for n in water.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
shader.inputs["IOR"].default_value = 1.333
noise = water.node_tree.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value = 6
noise.inputs["Detail"].default_value = 3
coords = water.node_tree.nodes.new("ShaderNodeTexCoord")
mapping = water.node_tree.nodes.new("ShaderNodeVectorMath")
mapping.operation = "MULTIPLY"
mapping.inputs[1].default_value = (0.55, 2.5, 1)
water.node_tree.links.new(coords.outputs["Object"], mapping.inputs[0])
water.node_tree.links.new(mapping.outputs[0], noise.inputs["Vector"])
bump = water.node_tree.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.65
bump.inputs["Distance"].default_value = 0.16
water.node_tree.links.new(noise.outputs["Fac"], bump.inputs["Height"])
water.node_tree.links.new(bump.outputs[0], shader.inputs["Normal"])
box("Canal water", (0, 8, -0.8), (110, 16, 0.06), water)
stone = material("Quay warm granite", (0.23, 0.245, 0.23), 0.9)
paving = material("Quay paving", (0.43, 0.42, 0.37), 0.9)
box("Opposite quay retaining wall", (0, 16.5, -0.5), (110, 1.1, 0.8), stone)
box("Opposite promenade", (0, 18.2, -0.08), (110, 4.4, 0.25), paving)
box("ROC waterside ledge", (0, 1.9, -0.27), (12, 1.1, 0.45), stone)
iron = material("Quay painted iron", (0.035, 0.042, 0.04), 0.55, 0.5)
for x in range(-45, 46, 3):
    box("Quay bollard", (x, 16.2, 0.32), (0.13, 0.13, 0.65), iron, 0.035)
box("Quay railing", (0, 16.2, 0.53), (95, 0.04, 0.045), iron)

trim = material("Facade painted stone trim", (0.72, 0.70, 0.62), 0.8)
window = material("Facade shaded glazing", (0.07, 0.12, 0.15), 0.22, 0.45)
roof = material("Terracotta roof", (0.23, 0.075, 0.035), 0.9)
facades = [material("Waterfront facade " + str(i), c, 0.9) for i,c in enumerate([
    (0.61,0.45,0.27), (0.65,0.61,0.48), (0.38,0.19,0.12),
    (0.65,0.67,0.61), (0.56,0.39,0.27), (0.74,0.66,0.48)])]
for i in range(15):
    x = (i-7)*5.5
    height = rng.choice([6.6, 7.2, 8.0, 8.5])
    width = 5.3
    box("Canal townhouse", (x, 23, 0.65+height/2), (width, 6, height), facades[i%len(facades)], 0.025)
    box("Facade plinth", (x, 19.94, 1.05), (width, 0.13, 0.8), stone)
    for z in (2.1, 4.25, 6.4):
        if z+0.8 > height:
            continue
        for dx in (-1.65, 0, 1.65):
            box("Window surround", (x+dx, 19.91, z), (1.04, 0.12, 1.6), trim)
            box("Window glazing", (x+dx, 19.83, z), (0.85, 0.03, 1.4), window)
            box("Window mullion", (x+dx, 19.8, z), (0.045, 0.04, 1.4), trim)
            box("Window transom", (x+dx, 19.8, z+0.15), (0.86, 0.04, 0.045), trim)
    box("Facade cornice", (x, 19.91, height+0.53), (width+0.15, 0.25, 0.2), trim)
    verts = [(x-width/2,19.8,height+0.65),(x+width/2,19.8,height+0.65),
             (x-width/2,23,height+2),(x+width/2,23,height+2),
             (x-width/2,26.2,height+0.65),(x+width/2,26.2,height+0.65)]
    mesh = bpy.data.meshes.new("Pitched roof geometry")
    mesh.from_pydata(verts, [], [(0,1,3,2),(2,3,5,4),(0,2,4),(1,5,3)])
    obj = bpy.data.objects.new("Townhouse pitched roof", mesh)
    scene.collection.objects.link(obj)
    obj.data.materials.append(roof)

world_nodes = scene.world.node_tree.nodes
sky = world_nodes.new("ShaderNodeTexSky")
sky.sky_type = "MULTIPLE_SCATTERING"
sky.sun_elevation = math.radians(32)
sky.sun_rotation = math.radians(145)
sky.sun_disc = True
scene.world.node_tree.links.new(sky.outputs["Color"], world_nodes["Background"].inputs["Color"])
world_nodes["Background"].inputs["Strength"].default_value = 0.07
area("Canal daylight through windows", (0, 5, 5), (0, 0.3, 0.9), 500, 7, (0.86,0.94,1))

# Retain the approved interior composition, black chairs, ceiling, and authentic UI.
scene.camera.location.z = 1.45
scene.camera.rotation_euler = (Vector((0, 0.65, 1.1)) - scene.camera.location).to_track_quat("-Z", "Y").to_euler()
scene.cycles.samples = 16 if draft else 48
scene.cycles.transparent_max_bounces = 12
scene.render.resolution_x = 1280 if draft else 2560
scene.render.resolution_y = 720 if draft else 1440
scene.render.resolution_percentage = 100
report = base["report"]
report["changes"] += ["Restored visibility through existing rear window panels", "Added generic modeled canal, quay and waterfront buildings", "Added a dedicated unobstructed single-station view"]
report["review_only"] += ["Generic canal setting; not a reconstruction of an actual CSTRIDER site"]
report["render"]["size"] = [scene.render.resolution_x, scene.render.resolution_y]
report["render"]["samples"] = scene.cycles.samples
(OUT / "canal-render-notes.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / "CSTRIDER-canal-review.blend"), compress=True)

scene.camera.location = (0, -5.0, 1.58)
scene.camera.rotation_euler = (Vector((0, 0.62, 1.05)) - scene.camera.location).to_track_quat("-Z", "Y").to_euler()
scene.camera.data.lens = 34
scene.render.filepath = str(OUT / ("cstrider-canal-wide-draft.png" if draft else "cstrider-canal-wide-2560.png"))
if not station_only:
    print("CANAL_WIDE_RENDER_START", flush=True)
    bpy.ops.render.render(write_still=True)
    print("CANAL_WIDE_RENDER_DONE", scene.render.filepath, flush=True)

# The single-station view prioritises an unobstructed read of the complete 3+2 array.
right_chair = bpy.data.objects.get("Leather office chair.001")
if right_chair:
    for obj in [right_chair, *right_chair.children_recursive]:
        obj.hide_render = True
scene.camera.location = (1.35, -2.35, 1.48)
scene.camera.rotation_euler = (Vector((1.35, 0.82, 1.17)) - scene.camera.location).to_track_quat("-Z", "Y").to_euler()
scene.camera.data.lens = 55
scene.render.filepath = str(OUT / ("cstrider-station-five-screens-draft.png" if draft else "cstrider-station-five-screens-2560.png"))
if not wide_only:
    print("CANAL_STATION_RENDER_START", flush=True)
    bpy.ops.render.render(write_still=True)
    print("CANAL_STATION_RENDER_DONE", scene.render.filepath, flush=True)
if right_chair:
    for obj in [right_chair, *right_chair.children_recursive]:
        obj.hide_render = False
