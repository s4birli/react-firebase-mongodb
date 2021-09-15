import React, { useEffect, useState } from 'react';

import CardBox from '../../components/CardBox';
import { Table, Tag, Space, Button, Modal, Form } from 'antd';
import ContainerHeader from '../../components/ContainerHeader';
import PlayerForm from '../../components/Forms/PlayerForm';
import {
  newPlayer,
  getPlayers,
  updatePlayer,
  deletePlayer
} from '../../appRedux/actions/Player';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getTeams } from '../../appRedux/actions/Team';

// eslint-disable-next-line

const SamplePage = () => {
  const [playerModal, setPlayerModal] = useState(false);
  const [isUpdating, setUpdating] = useState(false);
  const [form] = Form.useForm();
  const data = useSelector(({ player }) => player.players);
  const teams = useSelector(({ team }) => team.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPlayers());
    dispatch(getTeams());
  }, [dispatch]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name'
    },
    {
      title: 'Date of Birth',
      dataIndex: 'birthday',
      key: 'birthday'
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
      render: (id) => {
        return <>{teams.find((item) => item?._id === id)?.name}</>;
      }
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality'
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
    dispatch(deletePlayer(id));
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
    data.birthday = data.birthday.format('YYYY-MM-DD');
    if (isUpdating) {
      setUpdating(false);
      return dispatch(updatePlayer({ ...data, _id: isUpdating }));
    }
    dispatch(newPlayer(data));
  };

  const onCancel = () => {
    setPlayerModal(false);
    setUpdating(false);
  };

  return (
    <div>
      <ContainerHeader title={'Players'} />

      <CardBox>
        <Button
          className="gx-btn gx-btn-primary gx-mb-3 gx-mr-0"
          onClick={handleNew}
        >
          New Player
        </Button>
        <Table columns={columns} dataSource={data} />
      </CardBox>

      <Modal
        title={`${isUpdating ? 'Edit' : 'New'} Player`}
        visible={playerModal}
        onOk={() => form.submit()}
        maskClosable={false}
        onCancel={onCancel}
      >
        <PlayerForm form={form} onFinish={submitFinish} visible={playerModal} teams={teams} />
      </Modal>
    </div>
  );
};

export default SamplePage;
