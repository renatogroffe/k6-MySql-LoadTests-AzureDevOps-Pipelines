import sql from 'k6/x/sql';
import faker from "k6/x/faker";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const db = sql.open('mysql', '#{DatabaseTestsConnection}#');

export function teardown() {
  db.close();
}

export default function () {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  db.exec(`INSERT INTO Accounts (FullName, Email, CreditCardNumber, CVV) ` +
    `VALUES('${firstName} ${lastName}', ` +
    `'${firstName.toLowerCase()}.${lastName.toLowerCase()}@${faker.internet.domainName()}', ` +
    `'${faker.payment.creditCardNumberFormatted()}', '${faker.payment.creditCardCVV()}');`);
}

export function handleSummary(data) {
  return {
    "db-loadtests.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true })
  };
}