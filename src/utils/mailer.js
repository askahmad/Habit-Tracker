import emailjs from '@emailjs/browser';

// EmailJS Configuration from environment or localStorage
export const getEmailConfig = () => {
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || localStorage.getItem('habitpulse_emailjs_service_id') || 'service_k1twokp',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || localStorage.getItem('habitpulse_emailjs_template_id') || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || localStorage.getItem('habitpulse_emailjs_public_key') || '',
  };
};

export const saveEmailConfig = (serviceId, templateId, publicKey) => {
  if (serviceId) localStorage.setItem('habitpulse_emailjs_service_id', serviceId.trim());
  if (templateId) localStorage.setItem('habitpulse_emailjs_template_id', templateId.trim());
  if (publicKey) localStorage.setItem('habitpulse_emailjs_public_key', publicKey.trim());
};

export const isEmailConfigured = () => {
  const cfg = getEmailConfig();
  return Boolean(cfg.serviceId && cfg.templateId && cfg.publicKey);
};

/**
 * Dispatches a real 6-digit verification code to the user's Gmail
 * @param {string} toEmail - Recipient email (e.g. ahmadkha8143@gmail.com)
 * @param {string} toName - Recipient name
 * @param {string} code - 6-digit OTP code
 */
export async function sendVerificationOtpEmail(toEmail, toName, code) {
  const config = getEmailConfig();

  // If EmailJS keys are provided, send the actual email!
  if (config.serviceId && config.templateId && config.publicKey) {
    try {
      const templateParams = {
        to_email: toEmail,
        to_name: toName || toEmail.split('@')[0],
        otp_code: code,
        app_name: 'HabitIQ',
        support_email: 'support@habitiq.io'
      };

      const res = await emailjs.send(
        config.serviceId,
        config.templateId,
        templateParams,
        config.publicKey
      );

      console.log('✅ [EmailJS] Verification email dispatched successfully:', res.status, res.text);
      return { success: true, mode: 'real_email' };
    } catch (err) {
      console.error('❌ [EmailJS Error]:', err);
      return { success: false, error: err.text || err.message };
    }
  }

  // Fallback for local testing before keys are entered
  console.info(`ℹ️ [Email Simulation] Keys not yet added. Code sent for ${toEmail}: ${code}`);
  return { success: true, mode: 'simulated', code };
}

