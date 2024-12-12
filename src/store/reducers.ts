import { UPDATE_CAMPAIGN, UpdateCampaignAction } from './actions';

interface State {
  campaign: any; // Adjust the type of campaign as necessary
}

const initialState: State = {
  campaign: {},
};

const rootReducer = (state = initialState, action: UpdateCampaignAction): State => {
  switch (action.type) {
    case UPDATE_CAMPAIGN:
      return {
        ...state,
        campaign: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;