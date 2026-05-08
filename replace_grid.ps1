$file = "src\App.tsx"
$lines = Get-Content $file
$startLine = 380   # 0-indexed → line 381 (the <div className="grid...">
$endLine   = 475   # 0-indexed → line 476 (the </div> closing the grid)
$replacement = '              <ServiceCards />'
$out = $lines[0..($startLine-1)] + $replacement + $lines[$endLine..($lines.Length-1)]
Set-Content $file $out -Encoding UTF8
Write-Host "Done. New total lines: $($out.Length)"
