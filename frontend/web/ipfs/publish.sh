#!/bin/bash

SCALEWAY_GET_PINS_OUTPUT="scaleway_pins.txt"
SCALEWAY_REGION_ID="fr-par"
SCALEWAY_VOLUME_ID="80c8d0e5-539a-4bed-af4a-77c0d767684a"
SCALEWAY_NAME_ID="2e839d89-8294-4eab-87c1-f2156a67cac4"
SCALEWAY_NAME_VALUE="k51qzi5uqu5dho5qg1jmfx7n8sptx7xwhb6kogg4vzto2lpz2gxcooz0ajl3sz"
SCALEWAY_PIN_NAME="Le Monde 3.0 (frontend)"
SCALEWAY_AUTH_TOKEN="f8b6f9a8-41d5-4b4d-b118-7017b57fe611"

exit_if_failure() {
    exit_status=$?
    if [ $exit_status != 0 ]; then
        echo $1
        exit $exit_status
    fi
}

# 1. Build frontend
echo "1. Building frontend..."
cd ../ && npm run build && cd ipfs
exit_if_failure "Failed to build frontend."

# 2. Add frontend build to IPFS and get CID
echo "2. Adding frontend build to IPFS..."
NEW_CID=$(ipfs add -Q -r ../build)
exit_if_failure "Failed to add to IPFS."

# 3. Update IPFS name with new CID
echo "3. Updating Scaleway name $SCALEWAY_NAME_ID with new CID..."
curl -f -X PATCH \
    -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "value": "'"$NEW_CID"'"
    }' \
    "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/names/$SCALEWAY_NAME_ID"
exit_if_failure "Failure."
echo ""

# 4. Get Scaleway pins
echo "4. Getting Scalway pins..."
curl -f -X GET \
    -H "Content-Type: application/json" \
    -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
    "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins?order_by=created_at_asc&volume_id=$SCALEWAY_VOLUME_ID" \
    >$SCALEWAY_GET_PINS_OUTPUT
cat $SCALEWAY_GET_PINS_OUTPUT
exit_if_failure "Failure."
echo ""

# 5. Delete Scaleway pins
echo "5. Deleting Scaleway pins..."
PINS=$(jq -r '.pins[] | .pin_id' $SCALEWAY_GET_PINS_OUTPUT)
for pin in $PINS; do
    curl -f -X DELETE \
        -H "Content-Type: application/json" \
        -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
        "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins/$pin?volumes/$SCALEWAY_VOLUME_ID"
    exit_if_failure "Failure."
    echo "- pin $pin deleted."
done
rm -f $SCALEWAY_GET_PINS_OUTPUT

# 6. Pin CID
echo "6. Pinning new CID..."
curl -f -X POST \
    -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "cid": "'"$NEW_CID"'",
        "name": "'"$SCALEWAY_PIN_NAME"'",
        "volume_id": "'"$SCALEWAY_VOLUME_ID"'"
    }' \
    "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins/create-by-cid"
exit_if_failure "Failure."

echo ""
echo "Congratulations! The frontend build has been successfully:"
echo "- added to IPFS, its CID is $NEW_CID"
echo "- pinned"
echo "- linked to the name '$SCALEWAY_PIN_NAME'"
echo "Previous pins have also been deleted."
