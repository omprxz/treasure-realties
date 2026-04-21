<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = "omprxz@gmail.com";
    $subject = "New Lead from Treasure Realties: " . ($_POST['form_label'] ?? 'General Enquiry');
    
    $message = "You have received a new enquiry from the website.\n\n";
    $message .= "Form Name: " . ($_POST['form_label'] ?? 'Unknown Form') . "\n";
    $message .= "--------------------------------------------------\n";
    
    foreach ($_POST as $key => $value) {
        if ($key !== 'form_label') {
            $label = ucfirst(str_replace('_', ' ', $key));
            $message .= "$label: $value\n";
        }
    }
    
    $message .= "--------------------------------------------------\n";
    $message .= "Sent on: " . date('Y-m-d H:i:s') . "\n";
    
    $headers = "From: webmaster@treasurerealties.com\r\n";
    $headers .= "Reply-To: " . ($_POST['email'] ?? 'noreply@treasurerealties.com') . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'Thank you! Your message has been sent successfully.']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Oops! Something went wrong and we couldn\'t send your message.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
}
?>
