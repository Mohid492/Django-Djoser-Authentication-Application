from djoser import email


class ConfirmationEmail(email.ConfirmationEmail):
    template_name = 'account/confirmation.html'


class PasswordResetEmail(email.PasswordResetEmail):
    template_name = 'account/password_reset.html'


class PasswordChangedConfirmationEmail(email.PasswordChangedConfirmationEmail):
    template_name = 'account/password_changed_confirmation.html'

class UsernameResetEmail(email.UsernameResetEmail):
    template_name = 'account/username_reset.html'

class UsernameChangedConfirmationEmail(email.UsernameChangedConfirmationEmail):
    template_name = 'account/username_changed_confirmation.html'