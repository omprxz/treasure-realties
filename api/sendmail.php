<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = "omprxz@gmail.com";
    $label = $_POST['form_label'] ?? 'General Enquiry';
    $subject = "New Lead: " . $label . " | Treasure Realties";
    
    // Build HTML Message
    $message = "
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1F140D; line-height: 1.6; }
            .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
            .header { background: #1F140D; padding: 24px; text-align: center; }
            .header img { max-width: 180px; }
            .content { padding: 32px; background: #ffffff; }
            .footer { background: #f9f9f9; padding: 16px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eeeeee; }
            h2 { color: #D4AF37; margin-top: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 12px; text-transform: uppercase; width: 35%; }
            td { padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1F140D; font-weight: 500; }
            .tag { display: inline-block; background: #D4AF37; color: #1F140D; padding: 2px 8px; font-size: 10px; font-weight: bold; border-radius: 4px; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1 style='color:#D4AF37; margin:0; font-size:24px;'>TREASURE REALTIES</h1>
            </div>
            <div class='content'>
                <span class='tag'>$label</span>
                <h2>New Website Enquiry</h2>
                <p>Hello Bhagat Singh,</p>
                <p>You have received a new lead through the <b>Treasure Realties</b> portal. Below are the details:</p>
                <table>";
    
    foreach ($_POST as $key => $value) {
        if ($key !== 'form_label') {
            $displayKey = ucfirst(str_replace('_', ' ', $key));
            $message .= "<tr><th>$displayKey</th><td>" . nl2br(htmlspecialchars($value)) . "</td></tr>";
        }
    }
    
    $message .= "
                </table>
            </div>
            <div class='footer'>
                Sent from Treasure Realties Web Server &bull; " . date('Y-m-d H:i:s') . "
            </div>
        </div>
    </body>
    </html>";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Treasure Realties <webmaster@treasurerealties.com>\r\n";
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
