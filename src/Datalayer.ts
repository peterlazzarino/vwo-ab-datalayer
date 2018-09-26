import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";

declare var VWO: any;

const canUseDOM = typeof window !== "undefined";
const vwoReady = typeof VWO !== "undefined";

const currentCampaigns = [];
const campaignListeners = [];

(() => {
    if (canUseDOM && vwoReady) {
        VWO.onVariationApplied((x) => pushUpdate(x));
    }
})();

export const subscribeToCampaign = (callback, campaignId) => {
    const currentListener = campaignListeners[campaignId];
    const currentCampaign = currentCampaigns[campaignId];
    if (!currentListener) {
        campaignListeners[campaignId] = [];
    }
    if (currentCampaign) {
        callback(currentCampaign);
    }
    campaignListeners[campaignId].push(callback)
}

const pushUpdate = (campaign) => {
    const campaignId = campaign[1];
    const variantId = campaign[2];
    const listeners = campaignListeners[campaignId];
    const hasListeners = Array.isArray(listeners) && listeners.length > 0;
    storeCampaign(campaign, campaignId);
    if (!hasListeners) {
        return;
    }
    campaignListeners[campaign.campaignName].forEach(cb => {
        cb({
            //VWO not 0 based for variant index
            variantIndex: variantId,
            campaignId
        });
    });
}

const storeCampaign = (campaign, id) => {
    if (!currentCampaigns[id]) {
        currentCampaigns[id] = [];
    }
    currentCampaigns[id] = campaign;
}