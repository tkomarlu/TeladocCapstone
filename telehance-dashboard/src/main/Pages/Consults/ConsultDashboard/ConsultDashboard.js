import React from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithToken } from '../../../Util/fetch';
import { withRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import BootstrapTable from 'react-bootstrap-table-next';
import Button from 'react-bootstrap/Button';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Loading from '../../../Components/Loading/Loading';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './ConsultDashboard.css';

function renderConsults(consultList, columns) {
  const pagination = paginationFactory({
    lastPageText: '>>',
    sizePerPage: 10,
    firstPageText: '<<',
    nextPageText: '>',
    prePageText: '<',
    showTotal: true,
    alwaysShowAllBtns: true,
  });

  const { SearchBar } = Search;
  return (
    <ToolkitProvider
      bootstrap4
      keyField='id'
      data={consultList}
      columns={columns}
      search={{
        searchFormatted: true,
      }}
    >
      {(props) => (
        <div>
          <SearchBar {...props.searchProps} />
          <hr />
          <BootstrapTable pagination={pagination} {...props.baseProps} />
        </div>
      )}
    </ToolkitProvider>
  );
}

const ConsultDashboard = (props) => {
  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const awsToken = process.env.REACT_APP_CONSULT_API_KEY;
  const { data: consultList } = useSWR(
    [
      `https://53q2e7vhgl.execute-api.us-west-2.amazonaws.com/dev/consult-get-all?user_id=${user_id}`,
      awsToken,
    ],
    fetchWithToken
  );
  const dateFormatter = (cell, row) => {
    const date = new Date(Number(cell));
    return date.toLocaleString('default', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
  };
  const nameFormatter = (cell, row) => {
    return `${cell.family_name}, ${cell.given_name}`;
  };

  const sentimentFormatter = (cell, row) => {
    if ( typeof(cell) === 'number') {
      return `${Math.round(cell * 100)}%`;
    }
  }

  const buttonFormatter = (cell, row) => {
    return (
      <Button onClick={() => props.history.push(`/consults/${row.consult_id}`)}>
        View
      </Button>
    );
  };
  const columns = [
    {
      dataField: 'timestamp',
      text: 'Appointment Date',
      formatter: dateFormatter,
      sort: true,
    },
    {
      dataField: 'doctor',
      text: 'Doctor Name',
      formatter: nameFormatter,
    },
    {
      dataField: 'patient',
      text: 'Patient Name',
      formatter: nameFormatter,
    },
    {
      dataField: 'sentiment',
      text: 'Problematic Consult Rating',
      sort: true,
      formatter: sentimentFormatter,
    },
    {
      dataField: 'button',
      text: 'Actions',
      formatter: buttonFormatter,
    },
  ];
  return (
    <Container className='mb-5 text-center'>
      <h1>Consult Dashboard</h1>
      {consultList ? renderConsults(consultList, columns) : <Loading />}
    </Container>
  );
};

export default withRouter(ConsultDashboard);
