# create-test-images.ps1
# This script generates 14 images (2 question sets * 7 images each),
# to test your quiz app.

# For example:
# question1, correct1, wrong1a, wrong1b, wrong1c, wrong1d, wrong1e
# question2, correct2, wrong2a, wrong2b, wrong2c, wrong2d, wrong2e

param(
    [string]$OutputFolder = ".\images"
)

Write-Host "Generating test images in $OutputFolder ..."

# Make sure the folder exists
if (!(Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder | Out-Null
}

# Load System.Drawing
Add-Type -AssemblyName System.Drawing

function Create-ImageWithText {
    param(
        [string]$filename,
        [string]$text,
        [int]$width,
        [int]$height
    )

    # Create the bitmap
    $bmp = New-Object System.Drawing.Bitmap($width, $height)

    # Get a graphics object
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.SmoothingMode = "AntiAlias"

    # Fill background white
    $graphics.Clear([System.Drawing.Color]::White)

    # Text layout
    $font = New-Object System.Drawing.Font("Arial", 32, [System.Drawing.FontStyle]::Bold)
    $brush = [System.Drawing.Brushes]::Black

    # Center the text
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Draw the text
    $rect = New-Object System.Drawing.RectangleF(0, 0, $width, $height)
    $graphics.DrawString($text, $font, $brush, $rect, $format)

    # Save
    $fullpath = Join-Path $OutputFolder $filename
    $bmp.Save($fullpath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Clean up
    $graphics.Dispose()
    $bmp.Dispose()
}

# We want 2 sets of questions, i.e. 14 images total
# We'll pick a variety of sizes

$testData = @(
    # Set 1
    @{ name="question1"; w=400; h=300 },
    @{ name="correct1";  w=300; h=300 },
    @{ name="wrong1a";   w=500; h=400 },
    @{ name="wrong1b";   w=400; h=500 },
    @{ name="wrong1c";   w=600; h=300 },
    @{ name="wrong1d";   w=300; h=600 },
    @{ name="wrong1e";   w=200; h=400 },

    # Set 2
    @{ name="question2"; w=300; h=200 },
    @{ name="correct2";  w=360; h=360 },
    @{ name="wrong2a";   w=720; h=300 },
    @{ name="wrong2b";   w=200; h=200 },
    @{ name="wrong2c";   w=640; h=480 },
    @{ name="wrong2d";   w=400; h=200 },
    @{ name="wrong2e";   w=500; h=500 }
)

foreach ($item in $testData) {
    $filename = "$($item.name).png"
    $text = $item.name
    $w = $item.w
    $h = $item.h

    Write-Host "Creating $filename ($w x $h) with text '$text' ..."
    Create-ImageWithText -filename $filename -text $text -width $w -height $h

    # Wait a second so each file has a different creation time
    # (This helps ensure a consistent order if we rely on birthtime)
    Start-Sleep -Seconds 1
}

Write-Host "Done generating images!"
