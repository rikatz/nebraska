import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import _ from 'underscore';
import { applicationsStore } from '../../stores/Stores';
import ChannelItem from '../Channels/Item.react';
import { CardFeatureLabel, CardHeader, CardLabel } from '../Common/Card';
import Empty from '../Common/EmptyContent';
import ListItem from '../Common/ListItem';
import MoreMenu from '../Common/MoreMenu';
import VersionProgressBar from '../Common/VersionBreakdownBar';

const useStyles = makeStyles(theme => ({
  itemSection: {
    padding: '1em'
  },
}));

function Item(props) {
  const classes = useStyles();

  let version_breakdown = (props.group && props.group.version_breakdown) ? props.group.version_breakdown : [];
  let noInstancesLabel = 'None';
  let instances_total = props.group.instances_stats ? (props.group.instances_stats.total || noInstancesLabel) : noInstancesLabel;
  let description = props.group.description || 'No description provided';
  let channel = props.group.channel || {};

  let groupChannel = _.isEmpty(props.group.channel) ? <CardLabel>No channel provided</CardLabel>
    : <ChannelItem channel={props.group.channel} />
  let styleGroupChannel = _.isEmpty(props.group.channel) ? "italicText" : ""
  let groupPath = `/apps/${props.group.application_id}/groups/${props.group.id}`

  function deleteGroup() {
    let confirmationText = "Are you sure you want to delete this group?"
    if (confirm(confirmationText)) {
      applicationsStore.deleteGroup(props.group.application_id, props.group.id)
    }
  }

  function updateGroup() {
    props.handleUpdateGroup(props.group.application_id, props.group.id)
  }

  return (
    <ListItem disableGutters>
      <Grid
        container
      >
        <Grid item xs={12}>
          <CardHeader
            cardMainLinkLabel={props.group.name}
            cardMainLinkPath={groupPath}
            cardId={props.group.id}
            cardDescription={description}
          >
            <MoreMenu options={[
              {
              'label': 'Edit',
              'action': updateGroup,
              },
              {
                'label': 'Delete',
                'action': deleteGroup,
              }
            ]} />
          </CardHeader>
        </Grid>
        <Grid
          item
          xs={12}
          container
          justify="space-between"
          className={classes.itemSection}
        >
          <Grid item xs={6} container direction="column">
            <Grid item>
              <CardFeatureLabel>Instances:</CardFeatureLabel>&nbsp;
              <CardLabel labelStyle={{fontSize: '1.5rem'}}>
                <Link
                  to={groupPath}
                  component={RouterLink}
                >
                  {instances_total}
                </Link>
              </CardLabel>
            </Grid>
            <Grid item>
              <CardFeatureLabel>Channel:</CardFeatureLabel>
              {groupChannel}
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="column">
            <Grid item>
              <CardFeatureLabel>Updates:</CardFeatureLabel>&nbsp;
              <CardLabel>{props.group.policy_updates_enabled ? 'Enabled' : 'Disabled'}</CardLabel>
            </Grid>
            <Grid item>
              <CardFeatureLabel>Rollout Policy:</CardFeatureLabel>&nbsp;
              <CardLabel>Max {props.group.policy_max_updates_per_period} updates per {props.group.policy_period_interval}</CardLabel>
            </Grid>
            <Grid item container>
              <Grid item xs={12}>
                <CardFeatureLabel>
                  Version breakdown
                </CardFeatureLabel>
              </Grid>
              <Grid item xs={12}>
                {version_breakdown.length > 0 ?
                  <VersionProgressBar version_breakdown={version_breakdown} channel={channel} />
                :
                  <Empty>No instances available.</Empty>
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
}

Item.propTypes = {
    group: PropTypes.object.isRequired,
    appName: PropTypes.string.isRequired,
    channels: PropTypes.array.isRequired,
    handleUpdateGroup: PropTypes.func.isRequired
}

export default Item
