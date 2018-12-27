

<?php
$files = array();
foreach (new DirectoryIterator('./img') as $fileInfo) {
    if($fileInfo->isDot() || !$fileInfo->isFile()) continue;
    $files[] = $fileInfo->getFilename();
}

echo "<pre>";print_r (json_encode($files));
exit;
?>