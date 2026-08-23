<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    public function __construct(public string $token) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $resetUrl = "{$frontendUrl}/auth/reset-password?token={$this->token}&email=".urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->subject('Reset Password Akun Wihsata')
            ->greeting('Halo'.($notifiable->full_name ? ", {$notifiable->full_name}" : '').'!')
            ->line('Kami menerima permintaan untuk mereset password akun Wihsata Anda.')
            ->action('Reset Password', $resetUrl)
            ->line('Link ini akan kedaluwarsa dalam 60 menit.')
            ->line('Kalau Anda tidak meminta reset password, abaikan saja email ini — password Anda tidak akan berubah.');
    }
}
