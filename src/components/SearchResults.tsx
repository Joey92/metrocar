import { DateTime, Duration } from "luxon";
import { useMemo, useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import { MdDirectionsWalk } from "react-icons/md";
import { Itinerary, Plan } from "../types/backend";
import { ExternalInitiarary } from "./Itinarary";
import RouteBadge from "./RouteBadge";

interface Props {
  itineraries: Itinerary[];
  onSelectItinerary?: (idx: number) => void; // which itinerary should be expanded
  currentUserId?: string | null; // to hide/show ticket status
}

const SearchResults = ({
  itineraries,
  onSelectItinerary,
  currentUserId,
}: Props) => {
  const [selected, setSelectedItinerary] = useState(0);
  const itinaryFeatures = useMemo(() => {
    if (!itineraries) {
      return {};
    }

    return itineraries.reduce((i, currentItinary, idx) => {
      i[idx] = currentItinary.legs.map(
        ({ feature_fares: fares, feature_tickets: tickets }) => ({
          fares,
          tickets,
        })
      );

      return i;
    }, {} as { [index: number]: { fares?: boolean; tickets?: boolean }[] });
  }, [itineraries]);

  const { t } = useTranslation();

  return (
    <Accordion flush style={{ padding: 0 }}>
      {itineraries.map((itinerary, idx) => (
        <Accordion.Item eventKey={idx.toString()} key={idx}>
          <Accordion.Header
            onClick={() => {
              setSelectedItinerary(idx);
              if (onSelectItinerary) {
                onSelectItinerary(idx);
              }
            }}
          >
            <Container>
              <Row xs="auto" className="justify-content-space-between">
                <Col>
                  <Row xs="auto">
                    {itinerary.legs
                      .map((leg) => {
                        switch (leg.mode) {
                          case "BUS":
                            return (
                              <Col>
                                <RouteBadge
                                  name={leg.routeShortName!}
                                  color={leg.routeColor!}
                                  textColor={leg.routeTextColor!}
                                />
                              </Col>
                            );
                          case "WALK":
                          default:
                            return (
                              <Col>
                                <MdDirectionsWalk />{" "}
                                {Math.round(leg.duration / 60)}
                              </Col>
                            );
                        }
                      })
                      .flatMap((value, index, array) =>
                        array.length - 1 !== index // check for the last item
                          ? [value, <Col key={index}> &gt; </Col>]
                          : value
                      )}
                  </Row>
                </Col>
                <Col>
                  {itinaryFeatures[idx].find((feat) => feat.fares) &&
                    itinerary.fare &&
                    itinerary.fare.fare.regular && (
                      <h1>
                        {(
                          itinerary.fare.fare.regular.cents / 100
                        ).toLocaleString(undefined, {
                          style: "currency",
                          currency:
                            itinerary.fare.fare.regular.currency.currency,
                        })}
                      </h1>
                    )}
                </Col>
              </Row>
              <Row>
                <Col>
                  {DateTime.fromMillis(itinerary.startTime).toLocaleString(
                    DateTime.TIME_24_SIMPLE
                  )}
                  {" - "}
                  {DateTime.fromMillis(itinerary.endTime).toLocaleString(
                    DateTime.TIME_24_SIMPLE
                  )}{" "}
                  (
                  {Duration.fromMillis(itinerary.duration * 1000).toFormat(
                    "h:m"
                  )}
                  )
                </Col>
              </Row>
              <Row>
                <Col>
                  {itinerary.legs.length > 1 && (
                    <>
                      {DateTime.fromMillis(
                        itinerary.legs[1].startTime
                      ).toLocaleString(DateTime.TIME_24_SIMPLE)}{" "}
                      {t("pages:search.from_starting_point", {
                        station: itinerary.legs[1].from.name,
                      })}
                    </>
                  )}
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>
            <ExternalInitiarary
              {...itinerary}
              currentUserId={currentUserId}
              itinaryFeatures={itinaryFeatures[idx]}
            />
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default SearchResults;
