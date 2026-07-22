<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Get the TikTok URL from the query parameters
$videoUrl = isset($_GET['url']) ? $_GET['url'] : '';

if (empty($videoUrl)) {
    http_response_code(400);
    echo json_encode([
        "code" => -1,
        "message" => "Missing 'url' query parameter",
        "data" => null
    ]);
    exit;
}

// Target the free public API
$targetApi = "https://www.tikwm.com/api/?url=" . urlencode($videoUrl) . "&hd=1";

// Use cURL to fetch the data
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetApi);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode == 200 && $response) {
    $apiData = json_decode($response, true);
    
    if (isset($apiData['code']) && $apiData['code'] === 0 && isset($apiData['data'])) {
        $tkData = $apiData['data'];
        
        // Format to match SnaapTik's Android Kotlin Models perfectly
        $playUrl = isset($tkData['hdplay']) && !empty($tkData['hdplay']) ? $tkData['hdplay'] : (isset($tkData['play']) ? $tkData['play'] : '');
        
        $formattedResponse = [
            "code" => 0,
            "msg" => "Success",
            "data" => [
                "id" => isset($tkData['id']) ? $tkData['id'] : "unknown",
                "title" => isset($tkData['title']) ? $tkData['title'] : "TikTok Video",
                "cover" => isset($tkData['cover']) ? $tkData['cover'] : "",
                "play" => $playUrl,
                "music" => isset($tkData['music']) ? $tkData['music'] : "",
                "author" => [
                    "nickname" => isset($tkData['author']['nickname']) ? $tkData['author']['nickname'] : "Unknown",
                    "avatar" => isset($tkData['author']['avatar']) ? $tkData['author']['avatar'] : "",
                    "id" => isset($tkData['author']['unique_id']) ? $tkData['author']['unique_id'] : "unknown"
                ]
            ]
        ];
        
        echo json_encode($formattedResponse);
    } else {
        http_response_code(400);
        echo json_encode([
            "code" => -1,
            "message" => isset($apiData['msg']) ? $apiData['msg'] : "Failed to parse video",
            "data" => null
        ]);
    }
} else {
    http_response_code(500);
    echo json_encode([
        "code" => -1,
        "message" => "Internal Server Error",
        "data" => null
    ]);
}
?>
