import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

public class MGSamples {

    /**
     * Sends a professional booking confirmation email using Mailgun.
     *
     * @param recipientName  The recipient's full name.
     * @param recipientEmail The recipient's email address.
     * @param bookingDate    The date and time of the booking.
     * @return The Mailgun API response as a JsonNode.
     * @throws UnirestException if the HTTP request fails.
     */
    public static JsonNode sendBookingConfirmation(String recipientName, String recipientEmail, String bookingDate) throws UnirestException {
        String apiKey = System.getenv("API_KEY");
        if (apiKey == null) {
            apiKey = "YOUR_MAILGUN_API_KEY";
        }

        String domain = "YOUR_DOMAIN.mailgun.org";
        String from = "TutorMe Bookings <postmaster@" + domain + ">";
        String subject = "Your Tutorme Booking Confirmation";
        String text = String.format(
            "Dear %s,\n\nThank you for booking a tutoring session with Tutorme.\n\n" +
            "Your session is scheduled for: %s\n\n" +
            "If you have any questions or need to reschedule, please reply to this email.\n\n" +
            "Best regards,\nThe Tutorme Team",
            recipientName, bookingDate
        );

        HttpResponse<JsonNode> response = Unirest.post("https://api.mailgun.net/v3/" + domain + "/messages")
            .basicAuth("api", apiKey)
            .queryString("from", from)
            .queryString("to", String.format("%s <%s>", recipientName, recipientEmail))
            .queryString("subject", subject)
            .queryString("text", text)
            .asJson();

        return response.getBody();
    }

    public static void main(String[] args) {
        try {
            String recipientName = "Frederick Brogan";
            String recipientEmail = "frederickbrogan1892@gmail.com";
            String bookingDate = "Monday, 18 August 2025 at 3:00 PM";

            JsonNode response = sendBookingConfirmation(recipientName, recipientEmail, bookingDate);
            System.out.println("Email sent! Response: " + response.toString());
        } catch (UnirestException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}