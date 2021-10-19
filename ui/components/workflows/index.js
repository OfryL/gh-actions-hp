import React, {Fragment} from 'react';
import moment from 'moment';
import { PageHeader, Table, Tag } from 'antd';
import { flatten } from 'lodash';
import RunLink from '../runLink';
import StatusTag, { STATUS_MAP } from '../statusTag';
import {AppContainer} from "./style";

export default ({data: {repoToWorkflows}}) => {
  const columns = [
    {
      title: 'Time',
      dataIndex: 'run_started_at',
      render: (text) => moment(text).format('HH:mm MMM DD, yyyy'),
      sorter: (a, b) => moment(a.run_started_at).isBefore(moment(b.run_started_at)),
      sortOrder: 'ascend',
    },
    {
      title: 'Repo',
      dataIndex: '_repo_full_name',
      filters: Object.keys(repoToWorkflows).map(f => ({text: f, value: f,})),
      filterSearch: true,
      onFilter: (value, record) => record['_repo_full_name'].startsWith(value),
      render: (text, record) => <Fragment>{text} <Tag>{record['head_branch']}</Tag></Fragment>,
      width: '20%'
    },
    {
      title: '',
      dataIndex: 'conclusion',
      render: (text) => text && <StatusTag status={text} />,
      filters: Object.values(STATUS_MAP).map(f => ({text: f, value: f,})),
      filterSearch: true,
      onFilter: (value, record) => record['conclusion'] && record['conclusion'].startsWith(value),
    },
    {
      title: 'Commit message',
      dataIndex: 'head_commit_message',
      width: '40%'
    },
    {
      title: 'Author name',
      dataIndex: 'head_commit_author_name',
    },
    {
      title: 'Run',
      dataIndex: 'html_url',
      render: (text) => <RunLink url={text} />,
    },

  ];

  const orgName = Object.keys(repoToWorkflows)[0].split('/')[0];
  return (<AppContainer>
    <PageHeader
      className="site-page-header"
      onBack={() => window.location.href = 'https://github.com/'+orgName}
      title="Github actions"
      subTitle={orgName}
    />
  <Table dataSource={flatten(Object.values(repoToWorkflows))} columns={columns} />
  </AppContainer>);
};
