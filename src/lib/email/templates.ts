// Email templates for MusicUp notifications

export interface BookingConfirmationData {
  performerName: string;
  pieceName: string;
  composer: string | null;
  stage: string;
  venueName: string;
  venueAddress: string;
  concertDate: string;
  concertTime: string;
  seriesName: string;
  scoreUrl?: string | null;
  audioUrl?: string | null;
}

export function bookingConfirmationTemplate(data: BookingConfirmationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Concert Booking Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🎵 Concert Booking Confirmed!</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hi ${data.performerName},</p>

    <p>Your performance has been confirmed! Here are the details:</p>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #4F46E5; font-size: 18px;">Performance Details</h2>

      <p style="margin: 10px 0;"><strong>Piece:</strong> ${data.pieceName}</p>
      ${data.composer ? `<p style="margin: 10px 0;"><strong>Composer:</strong> ${data.composer}</p>` : ""}
      <p style="margin: 10px 0;"><strong>Difficulty:</strong> ${data.stage}</p>
      <p style="margin: 10px 0;"><strong>Concert:</strong> ${data.seriesName}</p>
    </div>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #4F46E5; font-size: 18px;">Location & Time</h2>

      <p style="margin: 10px 0;"><strong>Venue:</strong> ${data.venueName}</p>
      <p style="margin: 10px 0;"><strong>Address:</strong> ${data.venueAddress}</p>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${data.concertDate}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${data.concertTime}</p>
    </div>

    ${
      data.scoreUrl || data.audioUrl
        ? `
    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #4F46E5; font-size: 18px;">Practice Materials</h2>

      ${
        data.scoreUrl
          ? `<p style="margin: 10px 0;">
        <a href="${data.scoreUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px;">📄 Download Sheet Music</a>
      </p>`
          : ""
      }

      ${
        data.audioUrl
          ? `<p style="margin: 10px 0;">
        <a href="${data.audioUrl}" style="display: inline-block; background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">🎵 Listen to Song</a>
      </p>`
          : ""
      }
    </div>
    `
        : ""
    }

    <p style="margin-top: 20px;">See you at the concert!</p>

    <p style="margin-bottom: 0;">Best regards,<br>The MusicUp Team</p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
    <p>This is an automated message from MusicUp. Please do not reply to this email.</p>
  </div>
</body>
</html>
  `.trim();
}

export interface ConcertReminderData {
  performerName: string;
  pieceName: string;
  stage: string;
  venueName: string;
  venueAddress: string;
  concertDate: string;
  concertTime: string;
  seriesName: string;
  scoreUrl?: string | null;
  audioUrl?: string | null;
}

export function concertReminderTemplate(data: ConcertReminderData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Concert Reminder - 48 Hours</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #F59E0B; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">⏰ Concert Reminder</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hi ${data.performerName},</p>

    <p><strong>Your concert is in 48 hours!</strong> Here's a reminder of your performance details:</p>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #F59E0B; font-size: 18px;">Performance Details</h2>

      <p style="margin: 10px 0;"><strong>Piece:</strong> ${data.pieceName}</p>
      <p style="margin: 10px 0;"><strong>Difficulty:</strong> ${data.stage}</p>
      <p style="margin: 10px 0;"><strong>Concert:</strong> ${data.seriesName}</p>
    </div>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #F59E0B; font-size: 18px;">Location & Time</h2>

      <p style="margin: 10px 0;"><strong>Venue:</strong> ${data.venueName}</p>
      <p style="margin: 10px 0;"><strong>Address:</strong> ${data.venueAddress}</p>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${data.concertDate}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${data.concertTime}</p>
    </div>

    ${
      data.scoreUrl || data.audioUrl
        ? `
    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #F59E0B; font-size: 18px;">Last-Minute Practice</h2>

      ${
        data.scoreUrl
          ? `<p style="margin: 10px 0;">
        <a href="${data.scoreUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-right: 10px;">📄 Download Sheet Music</a>
      </p>`
          : ""
      }

      ${
        data.audioUrl
          ? `<p style="margin: 10px 0;">
        <a href="${data.audioUrl}" style="display: inline-block; background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">🎵 Listen to Song</a>
      </p>`
          : ""
      }
    </div>
    `
        : ""
    }

    <div style="background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #F59E0B;">
      <p style="margin: 0;"><strong>Pro tip:</strong> Arrive 15 minutes early to get settled and warmed up!</p>
    </div>

    <p style="margin-top: 20px;">We're looking forward to your performance!</p>

    <p style="margin-bottom: 0;">Best regards,<br>The MusicUp Team</p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
    <p>This is an automated reminder from MusicUp. Please do not reply to this email.</p>
  </div>
</body>
</html>
  `.trim();
}

export interface CompletionThankYouData {
  performerName: string;
  pieceName: string;
  concertDate: string;
  venueName: string;
  seriesName: string;
  hoursGranted: number;
  dashboardUrl: string;
}

export function completionThankYouTemplate(data: CompletionThankYouData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Performing!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #10B981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🎉 Thank You for Performing!</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hi ${data.performerName},</p>

    <p>Thank you for your wonderful performance at ${data.seriesName}!</p>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #10B981; font-size: 18px;">Performance Summary</h2>

      <p style="margin: 10px 0;"><strong>Piece:</strong> ${data.pieceName}</p>
      <p style="margin: 10px 0;"><strong>Concert:</strong> ${data.seriesName}</p>
      <p style="margin: 10px 0;"><strong>Venue:</strong> ${data.venueName}</p>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${data.concertDate}</p>
    </div>

    <div style="background-color: #D1FAE5; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center; border: 2px solid #10B981;">
      <h2 style="margin-top: 0; color: #10B981; font-size: 20px;">✨ Service Hours Credited</h2>
      <div style="font-size: 48px; font-weight: bold; color: #10B981; margin: 10px 0;">${data.hoursGranted}</div>
      <p style="margin-bottom: 0; color: #065F46;">hours have been added to your account</p>
    </div>

    <p style="text-align: center; margin: 20px 0;">
      <a href="${data.dashboardUrl}" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Hours Dashboard</a>
    </p>

    <p style="margin-top: 20px;">Your dedication to bringing music to the community is truly appreciated. We hope to see you at future concerts!</p>

    <p style="margin-bottom: 0;">With gratitude,<br>The MusicUp Team</p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
    <p>This is an automated message from MusicUp. Please do not reply to this email.</p>
  </div>
</body>
</html>
  `.trim();
}
</body>
</html>
  `.trim();
}

export interface VenueContactNotificationData {
  contactName: string;
  venueName: string;
  seriesName: string;
  concertDate: string;
  concertTime: string;
  venueAddress: string;
  performerCount: number;
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  notes?: string | null;
}

export function venueContactNotificationTemplate(
  data: VenueContactNotificationData
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Concert Scheduled at Your Venue</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #0891B2; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🎼 New Concert Scheduled at ${data.venueName}</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Hi ${data.contactName},</p>

    <p>A new concert has been scheduled at your venue. Please review the details below and confirm the date, time, and room availability.</p>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #0891B2; font-size: 18px;">Concert Details</h2>

      <p style="margin: 10px 0;"><strong>Concert Series:</strong> ${data.seriesName}</p>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${data.concertDate}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${data.concertTime}</p>
      <p style="margin: 10px 0;"><strong>Expected Performers:</strong> ${data.performerCount} ${data.performerCount === 1 ? "performer" : "performers"}</p>
    </div>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #0891B2; font-size: 18px;">Venue Information</h2>

      <p style="margin: 10px 0;"><strong>Venue:</strong> ${data.venueName}</p>
      <p style="margin: 10px 0;"><strong>Address:</strong> ${data.venueAddress}</p>
    </div>

    ${
      data.notes
        ? `
    <div style="background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #F59E0B;">
      <h3 style="margin-top: 0; color: #92400E; font-size: 16px;">📝 Additional Notes</h3>
      <p style="margin: 10px 0; color: #92400E;">${data.notes}</p>
    </div>
    `
        : ""
    }

    <div style="background-color: #E0F2FE; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #0891B2; font-size: 18px;">Event Coordinator Contact</h2>

      ${data.adminName ? `<p style="margin: 10px 0;"><strong>Name:</strong> ${data.adminName}</p>` : ""}
      ${data.adminEmail ? `<p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${data.adminEmail}" style="color: #0891B2;">${data.adminEmail}</a></p>` : ""}
      ${data.adminPhone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${data.adminPhone}" style="color: #0891B2;">${data.adminPhone}</a></p>` : ""}

      <p style="margin: 10px 0 0 0; font-size: 14px; color: #64748B;">Please contact the coordinator to confirm logistics and room setup.</p>
    </div>

    <div style="background-color: #FEF2F2; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #DC2626;">
      <h3 style="margin-top: 0; color: #991B1B; font-size: 16px;">⚠️ Action Required</h3>
      <p style="margin: 0; color: #991B1B;">Please confirm the following with the event coordinator:</p>
      <ul style="color: #991B1B; margin: 10px 0;">
        <li>Date and time availability</li>
        <li>Room/space assignment</li>
        <li>Any special setup requirements</li>
        <li>Parking and access instructions for performers</li>
      </ul>
    </div>

    <p style="margin-top: 20px;">Thank you for partnering with MusicUp to bring music to the community!</p>

    <p style="margin-bottom: 0;">Best regards,<br>The MusicUp Team</p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
    <p>This is an automated message from MusicUp. Please reply to the event coordinator for any questions.</p>
  </div>
</body>
</html>
  `.trim();
}
