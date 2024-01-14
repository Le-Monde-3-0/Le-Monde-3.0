#!/bin/bash

IPFS_HOST="ipfs_host"
SCALEWAY_GET_PINS_OUTPUT="scaleway_get_pins.txt"
SCALEWAY_POST_PIN_OUTPUT="scaleway_post_pin.txt"
SCALEWAY_GET_PIN_OUTPUT="scaleway_get_pin.txt"
SCALEWAY_REGION_ID="fr-par"
SCALEWAY_VOLUME_ID="80c8d0e5-539a-4bed-af4a-77c0d767684a"
SCALEWAY_NAME_ID="2e839d89-8294-4eab-87c1-f2156a67cac4"
SCALEWAY_NAME_VALUE="k51qzi5uqu5dho5qg1jmfx7n8sptx7xwhb6kogg4vzto2lpz2gxcooz0ajl3sz"
SCALEWAY_PIN_NAME="Le Monde 3.0 (frontend)"

exit_if_failure() {
    exit_status=$?
    if [ $exit_status != 0 ]; then
        echo $1
        docker stop $IPFS_HOST
        docker remove $IPFS_HOST
        exit $exit_status
    fi
}

# 0. Setup
echo "[Step 0]. Pull IPFS docker image and set env variables"
cd ../
WORKDIR=$(pwd)
cd ./ipfs
export ipfs_staging=$WORKDIR
export ipfs_data="$WORKDIR/ipfs"
touch $SCALEWAY_GET_PINS_OUTPUT
touch $SCALEWAY_POST_PIN_OUTPUT
touch $SCALEWAY_GET_PIN_OUTPUT
docker pull ipfs/kubo
exit_if_failure "Failed to pull IPFS docker image."
echo ""

# 1. Build frontend
echo "[Step 1]. Build frontend"
cd ../ && npm install && npm run build && cd ipfs
exit_if_failure "Failed to build frontend."

# 2. Run IPFS daemon
echo "[Step 2]. Run IPFS Daemon"
docker run -d --name $IPFS_HOST -v $ipfs_staging:/export -v $ipfs_data:/data/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/kubo:latest
exit_if_failure "Failed to run IPFS docker image."
sleep 3
echo ""

# 3. Add frontend build to IPFS and get CID
echo "[Step 3]. Add frontend build to IPFS"
NEW_CID=$(docker exec $IPFS_HOST ipfs add -Q -r /export/build)
exit_if_failure "Failed to add to IPFS."
echo "frontend build new CID is $NEW_CID"
echo ""

# 4. Update IPFS name with new CID
echo "[Step 4]. Update Scaleway name $SCALEWAY_NAME_ID with new CID"
curl -f -X PATCH \
    -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "value": "'"$NEW_CID"'"
    }' \
    "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/names/$SCALEWAY_NAME_ID"
exit_if_failure "Failed to update name with new CID."
echo ""
echo ""

# 5. Get Scaleway pins
echo "[Step 5]. Get Scalway pins"
curl -f -X GET \
    -H "Content-Type: application/json" \
    -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
    "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins?order_by=created_at_asc&volume_id=$SCALEWAY_VOLUME_ID" \
    >$SCALEWAY_GET_PINS_OUTPUT
exit_if_failure "Failed to get Scaleway pins."
cat $SCALEWAY_GET_PINS_OUTPUT
echo ""
echo ""

# 6. Delete Scaleway pins
echo "[Step 6]. Delete Scaleway pins"
PINS=$(jq -r '.pins[] | .pin_id' $SCALEWAY_GET_PINS_OUTPUT)
for pin in $PINS; do
    curl -f -X DELETE \
        -H "Content-Type: application/json" \
        -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
        "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins/$pin?volumes/$SCALEWAY_VOLUME_ID"
    exit_if_failure "Failed to delete Scaleway pin $pin."
    echo "- pin $pin deleted."
done
rm -f $SCALEWAY_GET_PINS_OUTPUT
echo ""

# 7. Pin CID
echo "[Step 7]. Pin new CID using Scaleway"
curl -f -X POST \
    -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "cid": "'"$NEW_CID"'",
        "name": "'"$SCALEWAY_PIN_NAME"'",
        "volume_id": "'"$SCALEWAY_VOLUME_ID"'"
    }' \
    "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins/create-by-cid" \
    >$SCALEWAY_POST_PIN_OUTPUT
exit_if_failure "Failed to pin new CID."
cat $SCALEWAY_POST_PIN_OUTPUT
echo ""
echo ""

# 8. Wait for pin
echo "[Step 8]. Wait for new PIN to have status 'pinned'"
NEW_PIN_ID=$(jq -r '.pin_id' $SCALEWAY_POST_PIN_OUTPUT)
PINNED=false
while [ "$PINNED" = "false" ]; do
    sleep 1
    curl -f -X GET \
        -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
        "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins/$NEW_PIN_ID?volume_id=$SCALEWAY_VOLUME_ID" \
        >$SCALEWAY_GET_PIN_OUTPUT
    exit_if_failure "Failed to get new pin $NEW_PIN_ID information."
    STATUS=$(jq -r '.status' $SCALEWAY_GET_PIN_OUTPUT)
    echo ". pin $NEW_PIN_ID status is $STATUS"
    if [ "$STATUS" = "pinned" ]; then
        PINNED=true
    fi
done
rm -f $SCALEWAY_GET_PIN_OUTPUT
rm -f $SCALEWAY_POST_PIN_OUTPUT
echo ""

# 9. Cleaning
echo "[Step 9]. Stop IPFS docker image and remove it"
docker stop $IPFS_HOST
docker remove $IPFS_HOST
echo ""

# 10. Conclusion
echo "Congratulations! The frontend build has been successfully:"
echo "- added to IPFS, its CID is $NEW_CID"
echo "- pinned"
echo "- linked to the name '$SCALEWAY_PIN_NAME'"
echo "Note: previous pins have also been deleted."
echo ""
echo "You can run:"
echo "- ipfs name resolve $SCALEWAY_NAME_VALUE"
echo "- ipfs get $NEW_CID"
echo "Note: don't forget to run your IPFS node!"