import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Container } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRouter } from "next/router";
import StandardLayout from "../components/layouts/Standard";
import Head from "next/head";

const paths = ["impress"];

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  if (!params || !params.slug) {
    return {
      notFound: true,
    };
  }

  const translations = await serverSideTranslations(locale || "en", ["common"]);
  const slug = params.slug as string;

  if (!paths.includes(slug)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...translations,
      // Will be passed to the page component as props
    },
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export const getStaticPaths: GetStaticPaths = async () => {
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: paths.map((path) => `/${path}`), fallback: "blocking" };
};

const StaticPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const slug = router.query.slug;
  return (
    <StandardLayout>
      <Head>
        <title>{t(`pages.${slug}.title`)}</title>
        <meta
          property="og:title"
          content={t(`pages.${slug}.title`)}
          key="title"
        />
      </Head>
      <Container className="static-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {t(`pages.${slug}.content`)}
        </ReactMarkdown>
      </Container>
    </StandardLayout>
  );
};

export default StaticPage;
