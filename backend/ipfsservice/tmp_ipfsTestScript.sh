#!/bin/bash

IPFS_HOST="ipfs_host"
SCALEWAY_REGION_ID="fr-par"

SCALEWAY_VOLUME_ID="a96392a0-843c-4cda-9f5e-f5899d931b92"

SCALEWAY_NAME_ID="d04f91c8-9d04-44a6-861f-31edecf61a6d"
SCALEWAY_NAME_VALUE="QmPiqNGrVg3Rixhtn38p7uWbi9YHMq2mEbaKaEvGrfQYBm"

SCALEWAY_PIN_NAME="Le Monde 3.0 (test article file)"
EXPORTFILENAME="articles.json"

SCALEWAY_AUTH_TOKEN="f0cc5fc1-594a-4792-8cfd-c534e639c251"

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
WORKDIR=$(pwd)
export ipfs_staging=$WORKDIR
export ipfs_data="$WORKDIR/ipfs"
docker pull ipfs/kubo
exit_if_failure "Failed to pull IPFS docker image."
echo ""

# # # 1. Build frontend
# # echo "[Step 1]. Build frontend"
# # cd ../ && npm install && npm run build && cd ipfs
# # exit_if_failure "Failed to build frontend."

# # 2. Run IPFS daemon
echo "[Step 2]. Run IPFS Daemon"
rm -f ./ipfs/repo.lock
docker run -d --name $IPFS_HOST -v $ipfs_staging:/export -v $ipfs_data:/ipfs -p 4001:4001 -p 4001:4001/udp -p 127.0.0.1:8081:8081 -p 127.0.0.1:5001:5001 ipfs/kubo:latest
exit_if_failure "Failed to run IPFS docker image."
sleep 3
echo ""

# # 3. Add file to IPFS and get CID
echo "[Step 3]. Add File to IPFS"
NEW_CID=$(docker exec $IPFS_HOST ipfs add -Q ipfs/$EXPORTFILENAME)
exit_if_failure "Failed to add to IPFS."
echo "file new CID is $NEW_CID"
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

# # # 5. Get Scaleway pins
echo "[Step 5]. Get Scalway pins"
SCALEWAY_GET_PINS_OUTPUT=$(curl -f -X GET \
    -H "Content-Type: application/json" \
    -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
    "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins?order_by=created_at_asc&volume_id=$SCALEWAY_VOLUME_ID")
exit_if_failure "Failed to get Scaleway pins."
echo $SCALEWAY_GET_PINS_OUTPUT
echo ""

# # # 6. Delete Scaleway pins
echo "[Step 6]. Delete Scaleway pins"
PINS=$(jq -r '.pins[] | .pin_id' <<< "$SCALEWAY_GET_PINS_OUTPUT")
for pin in $PINS; do
    curl -f -X DELETE \
        -H "Content-Type: application/json" \
        -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
        "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins/$pin?volumes/$SCALEWAY_VOLUME_ID"
    exit_if_failure "Failed to delete Scaleway pin $pin."
    echo "- pin $pin deleted."
done
echo ""

# # # 7. Pin CID
echo "[Step 7]. Pin new CID using Scaleway"
SCALEWAY_POST_PIN_OUTPUT=$(curl -f -X POST \
    -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "cid": "'"$NEW_CID"'",
        "name": "'"$SCALEWAY_PIN_NAME"'",
        "volume_id": "'"$SCALEWAY_VOLUME_ID"'"
    }' \
    "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins/create-by-cid")
exit_if_failure "Failed to pin new CID."
echo $SCALEWAY_POST_PIN_OUTPUT
echo ""

# # # 8. Wait for pin
echo "[Step 8]. Wait for new PIN to have status 'pinned'"
NEW_PIN_ID=$(jq -r '.pin_id' <<< "$SCALEWAY_POST_PIN_OUTPUT")
PINNED=false
while [ "$PINNED" = "false" ]; do
    sleep 1
    SCALEWAY_GET_PIN_OUTPUT=$(curl -f -X GET \
        -H "X-Auth-Token: $SCALEWAY_AUTH_TOKEN" \
        "https://api.scaleway.com/ipfs/v1alpha1/regions/$SCALEWAY_REGION_ID/pins/$NEW_PIN_ID?volume_id=$SCALEWAY_VOLUME_ID")
    exit_if_failure "Failed to get new pin $NEW_PIN_ID information."
    STATUS=$(jq -r '.status' <<< "$SCALEWAY_GET_PIN_OUTPUT")
    echo ". pin $NEW_PIN_ID status is $STATUS"
    if [ "$STATUS" = "pinned" ]; then
        PINNED=true
    elif [ "$STATUS" = "failed" ]; then
        echo "Pin status is failed."
        docker stop $IPFS_HOST
        docker remove $IPFS_HOST
        exit 1
    fi
done
echo ""

# # # 9. Cleaning
echo "[Step 9]. Stop IPFS docker image and remove it"
docker stop $IPFS_HOST
docker remove $IPFS_HOST
echo ""

# # # 10. Conclusion
echo "Congratulations! The file is uploaded successfully:"
echo "- added to IPFS, its CID is $NEW_CID"
echo "- pinned"
echo "- linked to the name '$SCALEWAY_PIN_NAME'"
echo "Note: previous pins have also been deleted."
echo ""
echo "You can run:"
echo "- ipfs name resolve $SCALEWAY_NAME_VALUE"
echo "- ipfs get $NEW_CID"
echo "Note: don't forget to run your IPFS node!"
