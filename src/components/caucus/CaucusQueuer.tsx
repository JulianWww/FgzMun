import * as React from 'react';
import firebase from 'firebase/app';
import { MemberData } from '../Member';
import { CaucusData, recoverDuration, recoverUnit } from '../Caucus';
import { MemberOption } from '../../constants';
import { Segment, Button, Form, Label, DropdownProps } from 'semantic-ui-react';
import { TimerSetter, Unit } from '../TimerSetter';
import { SpeakerEvent, Stance } from '..//caucus/SpeakerFeed';
import { checkboxHandler, validatedNumberFieldHandler, dropdownHandler } from '../../actions/handlers';
import { membersToPresentOptions } from '../../utils';
import { getCookie } from "../../cookie"

interface Props {
  caucus?: CaucusData;
  members?: Record<string, MemberData>;
  caucusFref: firebase.database.Reference;
  isOwner: boolean;
}

function getNation(props: Props) {
  if (props.members)
  {
    const nation = getCookie("nation");
    if (nation)
    {
      const members = props.members || {};
      return members[nation];
    }
  }
  return null;
}

function getIdOfCookieNation(name: MemberData | null, members: MemberOption[] | undefined)
{
  if (members && name) {
    for (let element of members) {
      if (element.text === name.name) {
        return element.key;
      }
    }
  }
  return null;
}

export default function CaucusQueuer(props: Props) {
  const { members, caucus, caucusFref, isOwner } = props;
  const [queueMember, setQueueMember] = React.useState<MemberOption | undefined>(undefined);
  const memberOptions = membersToPresentOptions(members);

  const setStance = (stance: Stance) => () => {
    const { caucus } = props;

    const duration = Number(recoverDuration(caucus));

    if (duration && queueMember) {
      const newEvent: SpeakerEvent = {
        who: queueMember.text,
        stance: stance,
        duration: recoverUnit(caucus) === Unit.Minutes ? duration * 60 : duration,
      };

      props.caucusFref.child('queue').push().set(newEvent);
    }
  }

  const setMember = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
    setQueueMember(memberOptions.filter(c => c.value === data.value)[0]);
  }

  const setMemberManual = (value: string): void => {
    setQueueMember(memberOptions.filter(c => c.value === value)[0]);
  }

  const cookieNation = getNation(props);
  const cookieNationKey = getIdOfCookieNation(cookieNation, memberOptions);
  const duration = recoverDuration(caucus);
  const disableButtons = !queueMember || !duration;

  if (!queueMember)
  {
    if (cookieNationKey)
      setMemberManual(cookieNationKey)
  }

  return (
    <Segment textAlign="center">
      <Label attached="top left" size="large">Queue</Label>
      <Form>
        <Form.Dropdown
          icon="search"
          value={queueMember ? queueMember.value : undefined}
          search
          selection
          disabled={!isOwner}
          loading={!caucus}
          error={!queueMember}
          onChange={setMember}
          options={memberOptions}
        />
        <TimerSetter
          disabled={!isOwner}
          loading={!caucus}
          unitValue={recoverUnit(caucus)}
          placeholder="Speaking time"
          durationValue={duration ? duration.toString() : undefined}
          onDurationChange={validatedNumberFieldHandler(caucusFref, 'speakerDuration')}
          onUnitChange={dropdownHandler(caucusFref, 'speakerUnit')}
        />
        <Form.Checkbox
          label="Delegates can queue"
          indeterminate={!caucus}
          disabled={!isOwner}
          toggle
          checked={caucus ? (caucus.queueIsPublic || false) : false} // zoo wee mama
          onChange={checkboxHandler<CaucusData>(caucusFref, 'queueIsPublic')}
        />
        <Button.Group size="large" fluid>
          <Button
            content="For"
            disabled={disableButtons}
            onClick={setStance(Stance.For)}
          />
          <Button.Or />
          <Button
            disabled={disableButtons}
            content="Neutral"
            onClick={setStance(Stance.Neutral)}
          />
          <Button.Or />
          <Button
            disabled={disableButtons}
            content="Against"
            onClick={setStance(Stance.Against)}
          />
        </Button.Group>
      </Form>
    </Segment>
  );
}