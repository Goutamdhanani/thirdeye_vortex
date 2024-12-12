interface SmtpAccount {
  id: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  imapHost: string;
  imapPort: string;
  imapUser: string;
  imapPass: string;
  fromEmail: string;
  accountName?: string;
}

class MailService {
  async sendEmail(to: string, subject: string, html: string, text?: string) {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html, text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  }

  saveSmtpAccount(account: SmtpAccount) {
    const accounts = this.getSmtpAccounts();
    const index = accounts.findIndex((acc) => acc.id === account.id);
    if (index !== -1) {
      accounts[index] = account;
    } else {
      accounts.push(account);
    }
    localStorage.setItem('smtpAccounts', JSON.stringify(accounts));
  }

  getSmtpAccounts(): SmtpAccount[] {
    const accounts = localStorage.getItem('smtpAccounts');
    return accounts ? JSON.parse(accounts) : [];
  }

  deleteSmtpAccount(id: string) {
    const accounts = this.getSmtpAccounts();
    const index = accounts.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      accounts.splice(index, 1);
      localStorage.setItem('smtpAccounts', JSON.stringify(accounts));
    }
  }

  async testSmtpConnection(account: SmtpAccount): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: account.fromEmail,
          subject: 'Test Email',
          html: '<p>This is a test email</p>',
          text: 'This is a test email',
        }),
      });

      if (!response.ok) {
        throw new Error('SMTP connection test failed');
      }

      return true;
    } catch (error) {
      console.error('SMTP connection test failed:', error);
      return false;
    }
  }

  async testImapConnection(account: SmtpAccount): Promise<boolean> {
    const imapConfig = {
      imap: {
        user: account.imapUser,
        password: account.imapPass,
        host: account.imapHost,
        port: parseInt(account.imapPort, 10),
        tls: true,
        authTimeout: 3000,
      },
    };

    try {
      const connection = await imaps.connect(imapConfig);
      await connection.openBox('INBOX');
      await connection.end();
      return true;
    } catch (error) {
      console.error('IMAP connection test failed:', error);
      return false;
    }
  }
}

const mailService = new MailService();
export default mailService;

// Export the other functions separately if needed
export function saveSmtpAccount(account: SmtpAccount) {
  return mailService.saveSmtpAccount(account);
}

export function getSmtpAccounts(): SmtpAccount[] {
  return mailService.getSmtpAccounts();
}

export function deleteSmtpAccount(id: string) {
  return mailService.deleteSmtpAccount(id);
}

export function testSmtpConnection(account: SmtpAccount): Promise<boolean> {
  return mailService.testSmtpConnection(account);
}

export function testImapConnection(account: SmtpAccount): Promise<boolean> {
  return mailService.testImapConnection(account);
}