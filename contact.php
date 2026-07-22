<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize input
    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    // Recipient email address
    $to = "ukuk1258@gmail.com"; 
    $subject = "New Contact Form Submission from USGStudio Website";

    // Build the email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Build the email headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Send the email
    if (mail($to, $subject, $email_content, $headers)) {
        // Redirect back with success message
        header("Location: index.html?status=success#contact");
    } else {
        // Redirect back with error message
        header("Location: index.html?status=error#contact");
    }
} else {
    // Not a POST request, redirect to home
    header("Location: index.html");
}
?>
