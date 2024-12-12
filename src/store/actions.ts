export const UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN';

export interface UpdateCampaignAction {
  type: typeof UPDATE_CAMPAIGN;
  payload: any; // Adjust the type of payload as necessary
}

export const updateCampaign = (data: any): UpdateCampaignAction => ({
  type: UPDATE_CAMPAIGN,
  payload: data,
});