# Diabetes Wrapped

This project aims to provide diabetics with a fun way to get an overview of their blood glucose levels over the course
of a year, in a way inspired by Spotify Wrapped.

Everything happens in the browser locally on the users device. This is a core concern as we are dealing with medical
data that is very sensitive to the individual.

## CGM Support

Currently there is support for the following CGMs:

| Data source    | mmol/L | mg/dL |
| -------------- | ------ |-------|
| Dexcom Clarity | ✅     | ✅     |
| LibreView      | ✅     | ✅     |
| NightScout     | ✅     | ✅     |

✅ = Full support

⛔ = No support, because I haven't been able to obtain example data

🕐️ = Soon

Want to help adding support for something and have the data? Please open an issue and we can work together to anonymize
it so I can implement it. Alternatively PRs are very welcome.
