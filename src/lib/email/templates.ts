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

export interface VenueReminderData {
  venueContactName: string;
  venueName: string;
  venueAddress: string;
  concertDate: string;
  concertTime: string;
  seriesName: string;
  hostName: string;
  hostEmail: string;
  hostPhone: string | null;
  performers: Array<{
    name: string;
    piece: string;
    stage: string;
  }>;
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

export function venueReminderTemplate(data: VenueReminderData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upcoming Concert Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #EB6A18; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🎵 Concert Reminder - 1 Week Away</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="margin-top: 0;">Dear ${data.venueContactName},</p>

    <p>This is a friendly reminder that <strong>${data.seriesName}</strong> is scheduled at your venue in one week!</p>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #EB6A18; font-size: 18px;">Event Details</h2>

      <p style="margin: 10px 0;"><strong>Concert:</strong> ${data.seriesName}</p>
      <p style="margin: 10px 0;"><strong>Venue:</strong> ${data.venueName}</p>
      <p style="margin: 10px 0;"><strong>Address:</strong> ${data.venueAddress}</p>
      <p style="margin: 10px 0;"><strong>Date:</strong> ${data.concertDate}</p>
      <p style="margin: 10px 0;"><strong>Time:</strong> ${data.concertTime}</p>
    </div>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #EB6A18; font-size: 18px;">Performers</h2>

      ${data.performers.map((performer, index) => `
        <div style="padding: 10px 0; ${index > 0 ? 'border-top: 1px solid #e5e7eb;' : ''}">
          <p style="margin: 5px 0;"><strong>${performer.name}</strong></p>
          <p style="margin: 5px 0; color: #6B7280;">Performing: ${performer.piece}</p>
          <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">${performer.stage}</p>
        </div>
      `).join('')}
    </div>

    <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #EB6A18; font-size: 18px;">Host Contact Information</h2>

      <p style="margin: 10px 0;">If you have any questions or need to make changes, please contact:</p>
      <p style="margin: 10px 0;"><strong>Name:</strong> ${data.hostName}</p>
      <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${data.hostEmail}" style="color: #EB6A18;">${data.hostEmail}</a></p>
      ${data.hostPhone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> ${data.hostPhone}</p>` : ''}
    </div>

    <div style="background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #F59E0B;">
      <p style="margin: 0;"><strong>Note:</strong> Please ensure the performance space is set up and ready for the scheduled time. Thank you for hosting this event!</p>
    </div>

    <p style="margin-top: 20px;">We're looking forward to a wonderful performance at your venue!</p>

    <p style="margin-bottom: 0;">Best regards,<br>The MusicUp Team</p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
    <p>This is an automated reminder from MusicUp. If you need assistance, please reply to ${data.hostEmail}.</p>
  </div>
</body>
</html>
  `.trim();
}
