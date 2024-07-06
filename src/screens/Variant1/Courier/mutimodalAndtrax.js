{
    isBackPressed && data?.packageWeight != 0 && routeRate?.rate?.cost != 0 && deliveryIn == 2 && (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
            }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                {/* this is for isInterIsLand = false */}
                {routeRate?.rate?.totalKgCost !== 0 && (
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            width: '100%',
                            alignItems: 'center',
                        }}>
                        <RadioButton
                            color={colors.activeColor}
                            uncheckedColor={colors.activeColor}
                            value="first"
                            status={checked === 'first' ? 'checked' : 'unchecked'}
                            onPress={() => {
                                scrollToBottom(490);
                                // setIsSelectedPaymentMethodError(false);
                                setisRateSelectedd(false);
                                isRateSelected.current = 1;
                                setData(prevData => ({
                                    ...prevData,
                                    routeId: routeRate?.rate.routeId,
                                    totalKgCost: routeRate?.rate.totalKgCost,
                                    optionId: routeRate?.rate.optionId,
                                    duration: routeRate?.rate.duration
                                }));
                                setChecked('first');
                            }}
                        />
                        <View
                            style={{
                                borderWidth: 1,
                                borderColor: '#d4d4d4',
                                borderRadius: 5,
                                paddingVertical: 8,
                                backgroundColor:
                                    checked == 'first'
                                        ? colors.primaryGreenColor
                                        : 'white',
                                alignItems: 'center',
                                paddingHorizontal: 6,
                            }}>
                            <TouchableOpacity
                            >
                                <View>
                                    {/* <Text
                      style={{
                        color: checked == 'first' ? 'white' : 'black',
                        fontWeight: 'bold',
                      }}>
                      Fastest Rate
                    
                    </Text> */}
                                    <Text
                                        style={{
                                            color: checked == 'first' ? 'white' : 'black',
                                        }}>
                                        {routeRate?.rate?.duration} Hours
                                    </Text>
                                    {/* <Text>Max 10kg</Text> */}
                                    <View
                                        style={{
                                            borderWidth: 0.5,
                                            marginVertical: 6,
                                            borderColor:
                                                checked == 'first' ? 'white' : 'black',
                                            width: '100%',
                                        }}></View>
                                    <Text
                                        style={{
                                            color: checked == 'first' ? 'white' : 'black',
                                        }}>
                                        From Rp {routeRate?.rate?.totalKgCost}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}


            </View>
        </View>
    )
}

//button next

const goToNextPage = (serviceFee, shippingFee, weightFee, wasliDeliveryFee, applicationFee, warehouseServiceFee, insuranceFee, totalAmount
    , environmentalFee, coldStorageFee) => {
    if (validateFields()) {

        const multimodelRoute = validRoute?.routeLists.find(route => route.id === 1);
        const TraxRoute = validRoute?.routeLists.find(route => route.id === 2);

        console.log("MultiModel---Routes-----", multimodelRoute)
        props.navigation.navigate(Routes.COURIER_DELIVERY_DETAILS, {
            pickupTitle: pickupTitle,
            dropOffTitle: dropOffTitle,
            pickupAddress: pickupAddress,
            dropOffAddress: dropOffAddress,
            pickupLat: pickupLat,
            pickupLng: pickupLng,
            dropOffLat: dropOffLat,
            dropOffLng: dropOffLng,
            categoryTypeId: 4,
            subDistrict: '',
            deliveryIn: deliveryIn,
            subDistrictIdPickUp: subDistrictIdPickUp,
            destinationLocationId: subDistrictIdDropOff,
            routeId: data?.routeId, //------->>>
            optionId: data?.optionId,
            packageName: data?.packageName,
            packageQty: data?.packageQty,
            packageWeight: data?.packageWeight,
            totalKgCost: data?.totalKgCost,
            duration: data?.duration,
            pickupAddressId: idp,
            dropOffAddressId: idd,
            fare: serviceFee + shippingFee + weightFee,
            applicationFee: deliveryIn == 1 ? applicationFee : routeRate?.applicationFee,
            insuranceFee: data?.insuranceFee || 0,
            levyFee: data?.levyFee || 0,
            serviceFee: data?.serviceFee || 0,
            shippingFee: data?.shippingFee || 0,
            weightFee: data?.weightFee || 0,
            warehouseServiceFee: data?.warehouseServiceFee || 0,
            wasliDeliveryFee: data?.wasliDeliveryFee || 0,
            dimensionId: data?.dimensionId || 0,
            Perishable: perishable,
            coldStorageFee:
                perishable === true
                    ? deliveryIn == 1
                        ? coldStorageFee
                        : routeRate?.coldStorageFee
                    : 0,
            environmentalFee:
                deliveryIn == 1
                    ? environmentalFee
                    : routeRate?.environmentalFee,
            isInterIsLand: multimodelRoute ? multimodelRoute.isInterIsLand : TraxRoute ? TraxRoute.isInterIsLand : false,
            warehouseFee: data?.warehouseFee,
            interIslandRateId: data?.InterIslandRateId,
            interIslandVal: data?.InterIslandVal,
            interIsLandShippingCost: data?.cost,
        });
    }
};