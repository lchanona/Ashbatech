<?php
// send-email.php for Ashba Technologies

// --- CONFIGURATION ---
$recipient_email = "info@ashbatech.com";
$recaptcha_secret = "6LcyZ4csAAAAAK_OhVdkVM93DO1v8k1H5armUew_"; // Replace with your Secret Key from Google
// ---------------------

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// 1. Verify reCAPTCHA
$recaptcha_response = $_POST['g-recaptcha-response'] ?? '';

if (empty($recaptcha_response)) {
    http_response_code(400);
    echo json_encode(["error" => "Please complete the reCAPTCHA."]);
    exit;
}

$verify_url = "https://www.google.com/recaptcha/api/siteverify";
$response = file_get_contents($verify_url . "?secret=" . $recaptcha_secret . "&response=" . $recaptcha_response);
$response_keys = json_decode($response, true);

if (!$response_keys["success"]) {
    http_response_code(403);
    echo json_encode(["error" => "reCAPTCHA verification failed. Please try again."]);
    exit;
}

// 2. Sanitize and Collect Form Data
$name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$company = filter_var($_POST['company'] ?? '', FILTER_SANITIZE_STRING);
$message = filter_var($_POST['message'] ?? '', FILTER_SANITIZE_STRING);

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["error" => "Please fill in all required fields."]);
    exit;
}

// 3. Prepare Email
$subject = "New Contact Form Message from: $name";
$email_content = "Name: $name\n";
$email_content .= "Email: $email\n";
$email_content .= "Company: " . ($company ?: "N/A") . "\n\n";
$email_content .= "Message:\n$message\n";

$email_headers = "From: $name <$recipient_email>\r\n";
$email_headers .= "Reply-To: $email\r\n";

// 4. Send Email
if (mail($recipient_email, $subject, $email_content, $email_headers)) {
    http_response_code(200);
    echo json_encode(["success" => "Thank you! Your message has been sent successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Oops! Something went wrong and we couldn't send your message."]);
}
?>
