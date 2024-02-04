import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Badge, Card, Container, Stack } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import StandardLayout from "../../components/layouts/Standard";
import { internalApi } from "../../services/directus";
import { Components, DirectusResponse } from "../../types/directus";
import _ from "lodash";
import {
  BsFillChatQuoteFill,
  // BsAlarm,
  // BsEmojiSmile,
  // BsSpeedometer,
  BsStarFill,
  // BsStars,
} from "react-icons/bs";
import RouteBadge from "../../components/RouteBadge";
import Head from "next/head";

interface ReviewAverages {
  overall: number | null;
  car_cleanliness: number | null;
  timeliness: number | null;
  driving_behaviour: number | null;
  driver_communication: number | null;
}

type ExtendedUser = Components.Schemas.Users & {
  trips: Components.Schemas.ItemsTrips[];
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const id = params.id as string;

  const apiResUser = await internalApi.get<DirectusResponse<ExtendedUser>>(
    `/users/${id}`,
    {
      params: {
        fields: ["display_name", "description"],
      },
    }
  );

  const userData = apiResUser.data.data;

  const apiResTrips = await internalApi.get<
    DirectusResponse<Components.Schemas.ItemsTrips[]>
  >(`/items/trips`, {
    params: {
      fields: ["*", "route.*"],
      filter: {
        _and: [
          {
            owner: {
              _eq: id,
            },
          },
          {
            start_date: {
              _gte: "$NOW(-1 month)",
            },
          },
        ],
      },
    },
  });

  const tripData = apiResTrips.data.data;

  const reviewRes = await internalApi.get<
    DirectusResponse<
      {
        avg: ReviewAverages;
      }[]
    >
  >(`/items/reviews`, {
    params: {
      meta: "filter_count",
      filter: {
        ticket: {
          trip: {
            owner: {
              id: {
                _eq: id,
              },
            },
          },
        },
      },
      aggregate: {
        avg: [
          "overall",
          "timeliness",
          "car_cleanliness",
          "driver_communication",
          "driving_behaviour",
        ],
      },
    },
  });

  // Average out the other reviewable things
  // and add it to the overall score
  const reviewAgg = reviewRes.data.data[0].avg;
  const reviewNumbers = Object.values(reviewAgg).map(parseFloat);
  const newReviewAvg = _.zipObject(Object.keys(reviewAgg), reviewNumbers);

  const { overall: overallReview, ...reviewData } = newReviewAvg;
  const {
    car_cleanliness,
    timeliness,
    driving_behaviour,
    driver_communication,
  } = reviewData;

  const overall =
    (overallReview +
      car_cleanliness +
      timeliness +
      driver_communication +
      driving_behaviour) /
    5;

  // Create a list of route badges this user took
  const routeSet = tripData
    .map((t) => t.route)
    .reduce((routes, route) => {
      if (!route) {
        return routes;
      }

      if (!route.route_short_name) {
        return routes;
      }

      if (!routes[route.route_short_name]) {
        routes[route.route_short_name] = { route, count: 1 };
        return routes;
      }

      routes[route.route_short_name].count += 1;
      return routes;
    }, {} as Record<string, { route: Components.Schemas.ItemsRoutes; count: number }>);

  const routes = Object.values(routeSet)
    .sort((a, b) => b.count - a.count)
    .map((r) => r.route);

  const badges = routes.splice(0, 5);

  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common", "pages"])),
      ...userData,
      reviewAverages: {
        ...reviewData,
        overall,
      },
      review_amount: reviewRes.data.meta?.filter_count,
      routes: {
        badges,
        hidden: routes,
      },
      trips_amount: tripData.length,
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
  return { paths: [], fallback: "blocking" };
};

const UserPage = ({
  display_name,
  description,
  trips_amount,
  reviewAverages,
  routes,
  review_amount,
}: Components.Schemas.Users & {
  trips_amount: number;
  reviewAverages: ReviewAverages;
  routes: {
    badges: Components.Schemas.ItemsRoutes[];
    hidden: Components.Schemas.ItemsRoutes[];
  };
  review_amount: number;
}) => {
  const { t } = useTranslation();

  return (
    <StandardLayout>
      <Head>
        <title>{t("pages:user.head.title", { name: display_name })}</title>
        <meta
          property="og:title"
          content={t("pages:user.head.title", { name: display_name })}
          key="title"
        />
      </Head>
      <Container>
        <Stack gap={3}>
          <h1>
            {display_name}{" "}
            <Badge bg={reviewAverages.overall ? "warning" : "secondary"}>
              {review_amount === 0 ? "--" : reviewAverages.overall}{" "}
              <BsStarFill />
            </Badge>
            {/* Show later */}
            {/* <Stack direction="horizontal" gap={3}>
            <Badge bg="secondary">
              <BsEmojiSmile />
              {reviewAverages.driver_communication}
            </Badge>
            <Badge bg="secondary">
              <BsSpeedometer />
              {reviewAverages.driving_behaviour}
            </Badge>
            <Badge bg="secondary">
              <BsStars />
              {reviewAverages.car_cleanliness}
            </Badge>
            <Badge bg="secondary">
              <BsAlarm />
              {reviewAverages.timeliness}
            </Badge>
          </Stack> */}
          </h1>
          {review_amount !== null &&
            t("pages:user.review_count", { count: review_amount })}

          <div>
            <h2>
              {t("pages:user.active_on_lines", {
                count: routes.badges.length + routes.hidden.length,
              })}
            </h2>
            <Stack direction="horizontal" gap={2}>
              {routes.badges.map((r) => (
                <RouteBadge
                  key={r.id}
                  name={r.route_short_name!}
                  textColor={r.route_text_color!}
                  color={r.route_color!}
                  href={`/routes/${r?.id}`}
                />
              ))}

              <div>
                {routes.hidden.length > 0 &&
                  t("pages:user.route_badge.hidden_amount", {
                    amount: routes.hidden.length,
                  })}
              </div>

              <div>
                {trips_amount > 0 &&
                  t("pages:user.trips_amount", {
                    count: trips_amount,
                  })}
              </div>
            </Stack>
          </div>

          {description && (
            <Card>
              <Card.Header>
                <BsFillChatQuoteFill />
              </Card.Header>
              <Card.Body className="user-description">{description}</Card.Body>
            </Card>
          )}
        </Stack>
      </Container>
    </StandardLayout>
  );
};

export default UserPage;
