# Run from the repository root before convert-volvo-assets.mjs.
# Read the original PPTX without changing it; extract only pictures and the two videos.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$source = Join-Path $PSScriptRoot '../public/volvo/Slutpresentation_kandidatarbetet.pptx'
$destination = Join-Path $PSScriptRoot '../scratch/volvo/media'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$destination = (Resolve-Path $destination).Path
$archive = [IO.Compression.ZipFile]::OpenRead((Resolve-Path $source))
try {
    foreach ($entry in $archive.Entries) {
        if ($entry.FullName -match '^ppt/media/[^/]+\.(mp4|png|jpg|jpeg)$') {
            [IO.Compression.ZipFileExtensions]::ExtractToFile($entry, (Join-Path $destination $entry.Name), $true)
        }
    }
} finally { $archive.Dispose() }

# Generate a greeting poster after the light reaches the steering wheel.
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Editing.MediaClip,Windows.Media.Editing,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Editing.MediaComposition,Windows.Media.Editing,ContentType=WindowsRuntime] | Out-Null
$asTaskMethod = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
})[0]
function Await-WinRT($operation, $resultType) {
    $task = $asTaskMethod.MakeGenericMethod($resultType).Invoke($null, @($operation))
    $task.Wait()
    $task.Result
}
$file = Await-WinRT ([Windows.Storage.StorageFile]::GetFileFromPathAsync((Join-Path $destination 'media7.mp4'))) ([Windows.Storage.StorageFile])
$clip = Await-WinRT ([Windows.Media.Editing.MediaClip]::CreateFromFileAsync($file)) ([Windows.Media.Editing.MediaClip])
$composition = [Windows.Media.Editing.MediaComposition]::new()
$collectionType = [System.Collections.Generic.ICollection``1].MakeGenericType([Windows.Media.Editing.MediaClip])
$collectionType.GetMethod('Add').Invoke($composition.Clips, @($clip))
$thumbnail = Await-WinRT ($composition.GetThumbnailAsync([TimeSpan]::FromSeconds(6.5), 1920, 1080, [Windows.Media.Editing.VideoFramePrecision]::NearestFrame)) ([Windows.Graphics.Imaging.ImageStream,Windows.Graphics.Imaging,ContentType=WindowsRuntime])
$stream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($thumbnail)
$output = [IO.File]::Create((Join-Path $destination 'greeting-poster.jpg'))
try { $stream.CopyTo($output) } finally { $output.Dispose(); $stream.Dispose() }
Write-Output 'Volvo source pictures, videos and greeting poster extracted to scratch/volvo/media.'
