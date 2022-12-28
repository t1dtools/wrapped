# Diabetes Wrapped

This project aims to provide diabetics with a fun way to get an overview of their blood glucose levels over the course
of a year, in a way inspired by Spotify Wrapped.

Everything happens in the browser locally on the users device. This is a core concern as we are dealing with medical
data that is very sensitive to the individual.

## CGM Support

Currently there is support for the following CGMs:

| Data source    | mmol/L | mg/dL |
| -------------- | ------ | ----- |
| Dexcom Clarity | ✅     | ⛔    |
| LibreView      | ✅     | ⛔    |
| NightScout     | ✅     | ✅    |

✅ = Full support

⛔ = No support, because I have not been able to obtain example data

Want to help add support for something and have the data? Please open an issue and we can work together to anonymize it
so I can implement it. Alternatively PRs are very welcome.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
