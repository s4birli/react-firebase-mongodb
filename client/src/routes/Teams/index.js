import React, { useEffect, useState } from 'react';
/* eslint no-use-before-define: 0 */
import CardBox from '../../components/CardBox';
import { Table, Space, Button, Modal, Form } from 'antd';
import ContainerHeader from '../../components/ContainerHeader';
import TeamForm from '../../components/Forms/TeamForm';
import {
  newTeam,
  getTeams,
  updateTeam,
  deleteTeam
} from '../../appRedux/actions/Team';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getPlayers, getNonePlayers } from '../../appRedux/actions';

// eslint-disable-next-line

const SamplePage = () => {
  const [playerModal, setPlayerModal] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const players = useSelector(({ player }) => player.players);
  const nonePlayers = useSelector(({player}) => player.nonePlayers);
  const data = useSelector(({ team }) => team.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTeams());
    dispatch(getPlayers());
    dispatch(getNonePlayers());
  }, [dispatch]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality'
    },
    {
      title: 'Players',
      dataIndex: 'players',
      key: 'players',
      render: (items) => (
        <>
          {items?.map(player => (
            <div>{players?.find(item => item._id === player)?.name}</div>
          ))}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleDelete(record._id)}>Delete</a>
        </Space>
      )
    }
  ];

  const handleDelete = (id) => {
    dispatch(deleteTeam(id));
  };

  const handleEdit = (player) => {
    form.resetFields();
    form.setFieldsValue({
      ...player,
      birthday: moment(player.birthday)
    });
    setPlayerModal(true);
    setUpdating(player._id);
  };

  const handleNew = () => {
    form.resetFields();
    setPlayerModal(true);
  };

  const submitFinish = () => {
    setPlayerModal(false);
    const data = form.getFieldsValue();

    if (isUpdating) {
      setUpdating(false);
      return dispatch(updateTeam({ ...data, _id: isUpdating }));
    }

    dispatch(newTeam(data));
  };

  const onCancel = () => {
    setPlayerModal(false);
    setUpdating(false);
  };

  const filterPlayers = () => {
    if (isUpdating)
      return players?.filter(
        (player) => player.team === isUpdating || !player.team
      );
    return nonePlayers;
  };

  return (
    <div>
      <ContainerHeader title={'Teams'} />

      <CardBox>
        <Button
          className="gx-btn gx-btn-primary gx-mb-3 gx-mr-0"
          onClick={handleNew}
        >
          New Team
        </Button>
        <Table columns={columns} dataSource={data} />
      </CardBox>

      <Modal
        title={`${isUpdating ? 'Edit' : 'New'} Team`}
        visible={playerModal}
        onOk={() => form.submit()}
        maskClosable={false}
        onCancel={onCancel}
      >
        <TeamForm
          form={form}
          onFinish={submitFinish}
          visible={playerModal}
          players={filterPlayers()}
        />
      </Modal>
    </div>
  );
};

export default SamplePage;
