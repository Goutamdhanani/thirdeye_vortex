

Here is a high-level overview of the file structure :

```
src/
components/
Campaign/
Steps/
SchedulingDelivery.tsx (renders scheduling delivery form)
ABTestingSetup.tsx (renders A/B testing setup form)
AudienceSetup.tsx (renders audience setup form)
EmailContent.tsx (renders email content form)
FollowupAutomation.tsx (renders follow-up automation form)
ReviewLaunch.tsx (renders review and launch form)
CampaignBasics.tsx (renders campaign basics form)
LeadsManager.tsx (renders leads manager form)
SequenceEditor.tsx (renders sequence editor form)
ErrorBoundary.tsx (catches and displays errors)
Header.tsx (renders header)
Sidebar.tsx (renders sidebar)
Leads/
LeadItem.tsx (renders individual lead item)
Campaign/
CampaignEditor.tsx (renders campaign editor)
CampaignItem.tsx (renders individual campaign item)
Sequence/
SequenceItem.tsx (renders individual sequence item)
SequenceEditor.tsx (renders sequence editor)
pages/
Dashboard.tsx (renders dashboard page)
CampaignsPage.tsx (renders campaigns page)
NewCampaignPage.tsx (renders new campaign page)
SettingsPage.tsx (renders settings page)
LeadsPage.tsx (renders leads page)
TemplatesPage.tsx (renders templates page)
AnalyticsPage.tsx (renders analytics page)
CampaignDetailPage.tsx (renders campaign detail page)
TestPage.tsx (renders test page)
store/
campaignStore.ts (manages campaign state)
services/
mailService.ts (handles email sending)
types/
campaign.ts (defines campaign types)
index.ts (defines index types)
main.tsx (renders main application)
App.tsx (renders app component)
index.css (defines global CSS styles)
```

Here's a brief description of what each file does:

**Components**

* `SchedulingDelivery.tsx`: Renders the scheduling delivery form, allowing users to set up campaign scheduling.
* `ABTestingSetup.tsx`: Renders the A/B testing setup form, allowing users to configure A/B testing for their campaigns.
* `AudienceSetup.tsx`: Renders the audience setup form, allowing users to select and configure their target audience.
* `EmailContent.tsx`: Renders the email content form, allowing users to create and edit email content.
* `FollowupAutomation.tsx`: Renders the follow-up automation form, allowing users to set up automated follow-up emails.
* `ReviewLaunch.tsx`: Renders the review and launch form, allowing users to review and launch their campaigns.
* `CampaignBasics.tsx`: Renders the campaign basics form, allowing users to set up basic campaign information.
* `LeadsManager.tsx`: Renders the leads manager form, allowing users to manage their leads.
* `SequenceEditor.tsx`: Renders the sequence editor form, allowing users to create and edit email sequences.
* `ErrorBoundary.tsx`: Catches and displays errors that occur in the application.
* `Header.tsx`: Renders the header component, displaying the application's title and navigation.
* `Sidebar.tsx`: Renders the sidebar component, displaying navigation and other utility links.
* `LeadItem.tsx`: Renders an individual lead item, displaying lead information.
* `CampaignEditor.tsx`: Renders the campaign editor component, allowing users to edit campaign information.
* `CampaignItem.tsx`: Renders an individual campaign item, displaying campaign information.
* `SequenceItem.tsx`: Renders an individual sequence item, displaying sequence information.
* `SequenceEditor.tsx`: Renders the sequence editor component, allowing users to create and edit email sequences.

**Pages**

* `Dashboard.tsx`: Renders the dashboard page, displaying an overview of the user's campaigns and leads.
* `CampaignsPage.tsx`: Renders the campaigns page, displaying a list of all campaigns.
* `NewCampaignPage.tsx`: Renders the new campaign page, allowing users to create a new campaign.
* `SettingsPage.tsx`: Renders the settings page, allowing users to configure application settings.
* `LeadsPage.tsx`: Renders the leads page, displaying a list of all leads.
* `TemplatesPage.tsx`: Renders the templates page, displaying a list of all email templates.
* `AnalyticsPage.tsx`: Renders the analytics page, displaying campaign analytics.
* `CampaignDetailPage.tsx`: Renders the campaign detail page, displaying detailed information about a campaign.
* `TestPage.tsx`: Renders the test page, allowing users to test their campaigns.

**Store**

* `campaignStore.ts`: Manages campaign state, providing a centralized store for campaign data.

**Services**

* `mailService.ts`: Handles email sending, providing a service for sending emails to leads.

**Types**

* `campaign.ts`: Defines campaign types, providing a set of types for working with campaigns.
* `index.ts`: Defines index types, providing a set of types for working with the application's index.

**Main**

* `main.tsx`: Renders the main application, providing the entry point for the application.
* `App.tsx`: Renders the app component, providing the top-level component for the application.
* `index.css`: Defines global CSS styles, providing a set of styles for the application.

