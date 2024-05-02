<script lang="ts">
  import { getMonth } from '$lib/datetime';
  import { formatPhoneNumber } from '$lib/formatting';

  const departurePoint: string = $$props.departurePoint;
  const destination: string = $$props.destination;
  const numberOfPeople: number = $$props.numberOfPeople;
  const departureTime: Date = $$props.departureTime;
  const arrivalTime: Date = $$props.arrivalTime;
  const modeOfTransport: string = $$props.modeOfTransport;
  const phoneNumber: string = $$props.phoneNumber;
  const authorName: string = $$props.authorName;
  const authorUid: string = $$props.authorUid;

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
</script>

<section>
  <h3>{departurePoint} - {destination}</h3>
  <table>
    <caption><a href="tel:{phoneNumber}">{formatPhoneNumber(phoneNumber)}</a></caption>
    <tbody>
      <tr>
        <th>ადგილი:</th>
        <td>{numberOfPeople}</td>
      </tr>
      <tr>
        <th>გამგზავრება:</th>
        <td>
          {departureTime.getDate()}
          {getMonth(departureTime)},
          {timeFormatter.format(departureTime)}
        </td>
      </tr>
      <tr>
        <th>ჩასვლა:</th>
        <td>
          {arrivalTime.getDate()}
          {getMonth(arrivalTime)},
          {timeFormatter.format(departureTime)}
        </td>
      </tr>
      <tr>
        <th>ტრანსპორტი:</th>
        <td>{modeOfTransport}</td>
      </tr>
      <tr>
        <th>ორგანიზატორი:</th>
        <td><a href="/profiles/{authorUid}">{authorName}</a></td>
      </tr>
    </tbody>
  </table>
</section>
