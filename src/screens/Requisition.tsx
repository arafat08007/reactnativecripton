import React, { useEffect, useState } from 'react';
import { View, ScrollView, SegmentedControlIOS } from 'react-native';
import { Text, ButtonGroup, Button, Icon } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { RouteProp, NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
//@ts-ignore
import { RootState } from '~/redux/store';
import { getRequisition, ApprovalInfo } from '~/redux/approvals';
import { appColors } from '~/theme';
import { RootStackParamList } from '~/App';
import StoreInfo from '~/components/StoreInfo';
import LeaveInfo from '~/components/LeaveInfo';
import ServiceInfo from '~/components/ServiceInfo';
import ApproveModal from '~/components/ApproveModal';
import ForwardModal from '~/components/ForwardModal';
import ResultModal from '~/components/ReqResultModal';
import api from '~/api';

type RequisitionScreenRouteProp = RouteProp<RootStackParamList, 'Requisition'>;
type Props = {
  route: RequisitionScreenRouteProp;
  navigation: NavigationProp<RootStackParamList, 'Requisitions'>
};

export default ({ route, navigation }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const approvalInfo = route.params.approvalInfo;
  const BaseInfo = route.params.approvalInfo.BaseInfo;
  const requisition = useSelector(
    (state: RootState) => state.approvals.requisitions[BaseInfo],
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRequisition(BaseInfo));
  }, []);

  const [forwardList, setForwardList] = useState([
    { Value: 'to', Text: 'To' },
  ]);
  useEffect(() => {
    if (!approvalInfo.IsForward) return;
    (async function () {
      const { data } = await api.get('/SspListForwardTo', {
        params: {
          ReqId: approvalInfo.ReqId,
        },
      });
      setForwardList(data);
    });
  }, [requisition]);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);

  const [result, setResult] = useState('');

  async function respond(response: 'Y' | 'R') {
    try {
      const { data } = await api.get('/SspSaveApproval', {
        params: {
          ReqId: approvalInfo.ReqId,
          sId: approvalInfo.Id,
          EmpId: user?.EmpId,
          Flag: response,
          FordId: '',
          ReqComt: '',
        },
      });
      setResult(`ReqNum #${approvalInfo.ReqNum} ${response === 'Y' ? 'accepted' : 'rejected'}`);
    } catch (e) {
      setResult('Submission failed')
    }
  }

  if (!requisition)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading.....</Text>
      </View>
    );
  const docType = requisition.DocType;
  const acceptButton = () => (
    <Button
      onPress={() => setShowApproveModal(true)}
      type="clear"
      icon={
        <Icon
          color={appColors.green}
          type="material-community"
          name="check-all"
        />
      }
    />
  );
  const forwardButton = () =>
    requisition.IsForward ? (
      <Button
        type="clear"
        icon={<Icon color={appColors.warning} type="entypo" name="forward" />}
        onPress={() => setShowForwardModal(true)}
      />
    ) : null;
  const rejectButton = () => (
    <Button
      type="clear"
      onPress={() => setShowRejectModal(true)}
      icon={
        <Icon
          color={appColors.red}
          name="close-circle-outline"
          type="material-community"
        />
      }
    />
  );
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {result ? <ResultModal message={result} close={() => {
        setResult('');
        navigation.navigate('Approval');
      }
      } /> : null}
      <ApproveModal
        isVisible={showApproveModal}
        close={() => setShowApproveModal(false)}
        approve={() => {
          respond('Y');
          setShowApproveModal(false);
        }}
      />
      <ApproveModal
        isVisible={showRejectModal}
        close={() => setShowRejectModal(false)}
        approve={() => {
          respond('R');
          setShowRejectModal(false);
        }}
      />
      <ForwardModal
        isVisible={showForwardModal}
        close={() => setShowForwardModal(false)}
        forward={async (id) => {
          setShowForwardModal(false);
          api.get('/SspSaveApproval', {
            params: {
              ReqId: approvalInfo.ReqId,
              sId: approvalInfo.Id,
              EmpId: user?.EmpId,
              Flag: '',
              FordId: id,
              ReqComt: '',
            },
          });
        }}
        data={forwardList}
      />
      <Text
        style={{ fontWeight: 'bold', textAlign: 'center', marginVertical: 5 }}>
        Requisition Details
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          padding: 15,
          margin: 5,
        }}>
        <View>
          <Text style={{ fontSize: 18 }}>{approvalInfo.RequesterName}</Text>
          <Text style={{ color: appColors.lightBlue }}>
            {approvalInfo.ReqDepName}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 18, color: appColors.green }}>
            {approvalInfo.ReqNum}
          </Text>
          <Text>{approvalInfo.ReqDate}</Text>
          <Text style={{ color: appColors.lightBlue }}>
            {approvalInfo.DocName}
          </Text>
          <Text style={{ color: appColors.red }}>
            {approvalInfo.ReqLocName}
          </Text>
        </View>
      </View>
      <ScrollView>
        {docType === 'Store' ? (
          <StoreInfo data={requisition.itemDetails} />
        ) : docType === 'Leave' ? (
          <LeaveInfo
            itemData={requisition.itemDetails}
            data={requisition.details!}
          />
        ) : docType === 'Service' ? (
          <ServiceInfo data={requisition.itemDetails} />
        ) : null}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 12 }}>
              {requisition.approverDetails[0]}
            </Text>
            <Text style={{ fontSize: 10 }}>
              {requisition.approverDetails[1]}
            </Text>
            <Text style={{ fontSize: 8 }}>
              {requisition.approverDetails[2]}
            </Text>
          </View>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 12 }}>
              {requisition.approverDetails[4]}
            </Text>
            <Text style={{ fontSize: 10 }}>
              {requisition.approverDetails[5]}
            </Text>
            <Text style={{ fontSize: 8 }}>
              {requisition.approverDetails[6]}
            </Text>
          </View>
        </View>
        {(approvalInfo.IsActive || approvalInfo.IsForward) && (
          <View>
            <ButtonGroup
              onPress={() => 0}
              buttons={[
                { element: acceptButton },
                { element: forwardButton },
                { element: rejectButton },
              ]}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};
