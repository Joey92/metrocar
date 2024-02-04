import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  CloseButton,
  Overlay,
  Popover,
  Stack,
} from "react-bootstrap";
import { Placement } from "react-bootstrap/types";
import { useTranslation } from "next-i18next";

export interface PopoverProperties {
  header: string;
  body: string;
  placement?: Placement;
}

export type Tutorials<E extends HTMLElement = HTMLElement> = [
  E | null,
  PopoverProperties
][];

export interface TutorialOverlayProps {
  tutorials: Tutorials;
  initiallyShow?: boolean;
}
const Tutorial = ({
  tutorials,
  initiallyShow = true,
}: TutorialOverlayProps) => {
  const [show, setShow] = useState(initiallyShow);
  const [tutorialIdx, setIdx] = useState(0);

  const { t } = useTranslation();

  const [target, text] = useMemo(() => {
    if (!tutorials || !tutorials[tutorialIdx]) {
      return [null, null];
    }

    return tutorials[tutorialIdx];
  }, [tutorials, tutorialIdx]);

  useEffect(() => {
    if (!target) {
      return;
    }

    target.scrollIntoView();
  }, [target]);

  if (!target) {
    return null;
  }

  return (
    <Overlay
      show={show}
      target={target}
      placement={text?.placement}
      containerPadding={20}
    >
      <Popover id="popover-contained">
        <Popover.Header as="h3">
          <Stack direction="horizontal">
            {text?.header}
            <CloseButton className="ms-auto" onClick={() => setShow(false)} />
          </Stack>
        </Popover.Header>
        <Popover.Body>
          <Stack gap={3}>
            {text?.body}
            {tutorials.length > 1 && (
              <ButtonGroup>
                {tutorialIdx !== 0 && (
                  <Button onClick={() => setIdx(tutorialIdx - 1)}>
                    {t("tutorial.previous")}
                  </Button>
                )}
                {tutorialIdx < tutorials.length - 1 && (
                  <Button onClick={() => setIdx(tutorialIdx + 1)}>
                    {t("tutorial.next")}
                  </Button>
                )}
              </ButtonGroup>
            )}
          </Stack>
        </Popover.Body>
      </Popover>
    </Overlay>
  );
};

export const useTutorial = () => {
  const [tutorials, setTutorials] = useState([] as Tutorials);

  return {
    tutorials,
    add:
      <E extends HTMLElement>(props: PopoverProperties) =>
      (instance: E | null) => {
        if (
          !instance ||
          tutorials.find(
            (v) => v[0] === instance || v[1].header === props.header
          )
        ) {
          return;
        }
        setTutorials([...tutorials, [instance, props]]);
      },
  };
};

export default Tutorial;
