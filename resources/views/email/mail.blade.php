@component('mail::message')

<x-mail::message>
# Hospital Jasin - Laporan Autopsy Anda sudah Sedia

Tuan/Puan,

Laporan autopsy anda telah sedia untuk diakses. Anda dikehendaki untuk datang di Kaunter untuk menerima laporan anda.
Terima kasih,
<br>
{{ config('app.name') }}
</x-mail::message>
@endcomponent