export const dateFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric', //"2-digit"
  year: 'numeric',
};

export const locales = [
  ['Argentina', 'es-AR'],
  ['Bulgarian', 'b-BG'],
  ['Chinese', 'zh-CN'],
  ['Dutch', 'nl-NL'],
  ['English', 'en-US'],
  ['English', 'en-GB'],
  ['French', 'fr-FR'],
  ['German', 'de-DE'],
  ['Greek', 'el-GR'],
  ['Hungarian', 'hu-HU'],
  ['Italian', 'it-IT'],
  ['Japanese', 'ja-JP'],
  ['Kongo', 'kg-CD'],
  ['Korean', 'ko-KR'],
  ['Luxembourgish', 'lb-LU'],
  ['Macedonian', 'mk-MK'],
  ['Maltese', 'mt-MT'],
  ['Moldavian', 'ro-MD'],
  ['Norwegian', 'nb-NO'],
  ['Polish', 'pl-PL'],
  ['Portuguese', 'pt-PT'],
  ['Romanian', 'ro-RO'],
  ['Russian', 'ru-RU'],
  ['Serbian', 'sr-RS'],
  ['Spanish', 'es-ES'],
  ['Turkish', 'tr-TR'],
  ['Ukrainian', 'uk-UA'],
];

const account1 = {
  owner: 'Adriana Pop',
  cardNumber: '**** **** **** 2345',
  cardValid: '**/26',

  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-05-09T14:11:59.604Z',
    '2024-07-27T17:01:17.194Z',
    '2024-07-28T23:36:17.929Z',
    '2024-07-29T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'ro-RO',
};

const account2 = {
  owner: 'Iulia Iftimie',
  cardNumber: '**** **** **** 1009',
  cardValid: '**/30',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

export const accounts = [account1, account2];
