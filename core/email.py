from djoser import email


class ConfirmationEmail(email.ConfirmationEmail):
    template_name = 'account/confirmation.html'


class PasswordResetEmail(email.PasswordResetEmail):
    template_name = 'account/password_reset.html'


class PasswordChangedConfirmationEmail(email.PasswordChangedConfirmationEmail):
    template_name = 'account/password_changed_confirmation.html'

