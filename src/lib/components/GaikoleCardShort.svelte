<script lang="ts">
  import { getMonth } from '$lib/datetime';
  import { formatPhoneNumber } from '$lib/formatting';

  const departurePoint: string = $$props.departurePoint;
  const numberOfPeople: number = $$props.numberOfPeople;
  const departureTime: Date = $$props.departureTime;
  const phoneNumber: string = $$props.phoneNumber;

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
</script>

<section>
  <h3>{departurePoint} - თბილისი</h3>
  <p>გვაქვს {numberOfPeople} თავისუფალი ადგილი.</p>
  <p>
    გასვლის დრო -
    {departureTime.getDate()}
    {getMonth(departureTime)},
    {timeFormatter.format(departureTime)}
  </p>
  <p><a href="tel:{phoneNumber}">{formatPhoneNumber(phoneNumber)}</a></p>
</section>
