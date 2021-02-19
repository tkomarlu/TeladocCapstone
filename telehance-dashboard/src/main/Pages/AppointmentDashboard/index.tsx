import React from 'react';
import useSWR from 'swr';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithToken, fetchWithUser } from 'Util/fetch';
import Spinner from 'Components/Spinner';
import BreadcrumbBar from 'Components/BreadcrumbBar/BreadcrumbBar';
import styles from './AppointmentDashboard.module.css';
import { Container } from 'react-bootstrap';
import {
  ButtonFormatter,
  dateFormatter,
  nameFormatter,
  purposeFormatter,
} from './getColumns';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ScheduleAppointment from 'Pages/AppointmentDashboard/AppointmentModal';
import { Column, TableWithBrowserPagination } from 'react-rainbow-components';

function getRole(appointmentList: any) {
  if (appointmentList[0].patient) return 'DOCTOR';
  else return 'PATIENT';
}

const customTotal = (from: number, to: number, size: number) => (
  <span className='react-bootstrap-table-pagination-total'>
    &nbsp; Showing Appointments {from} to {to} of {size}
  </span>
);

const pagination = paginationFactory({
  firstPageText: '<<',
  prePageText: '<',
  nextPageText: '>',
  lastPageText: '>>',
  sizePerPage: 10,
  showTotal: true,
  paginationTotalRenderer: customTotal,
  alwaysShowAllBtns: true,
});

function AppointmentDashboard({ history }: RouteComponentProps) {
  const { user } = useAuth0();
  const user_id = user ? user.sub.split('|')[1] : 'NULL';
  const userToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const appToken = process.env.REACT_APP_APPOINTMENT_API_KEY;
  const { data: roleInfo } = useSWR(
    [
      'https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id',
      userToken,
      'POST',
      user_id,
    ],
    fetchWithUser
  );
  const role = JSON.parse(roleInfo.body).role.toLowerCase();
  const { data: appointmentList, error } = useSWR(
    [
      `https://klnb89q4vj.execute-api.us-west-2.amazonaws.com/dev/by${role}?${role}_id=${user_id}`,
      appToken,
    ],
    fetchWithToken
  );
  if (error || (appointmentList && appointmentList.length === 0))
    return <h1 style={{ textAlign: 'center' }}>No Appointments</h1>;
  if (!appointmentList) return <Spinner />;
  return (
    <>
      <BreadcrumbBar page='Appointment Dashboard' />
      <Container className={styles.container}>
        {getRole(appointmentList) === 'PATIENT' && <ScheduleAppointment />}
        <TableWithBrowserPagination
          pageSize={5}
          data={appointmentList}
          keyField='id'
        >
          {getRole(appointmentList) === 'PATIENT' && (
            <Column
              header='Doctor'
              width={230}
              field='doctor'
              component={nameFormatter}
            />
          )}
          {getRole(appointmentList) === 'DOCTOR' && (
            <Column
              header='Patient'
              width={230}
              field='patient'
              component={nameFormatter}
            />
          )}
          <Column
            header='Appointment Date'
            width={180}
            field='start_time'
            component={dateFormatter}
          />
          <Column
            header='Purpose'
            width={570}
            field='purpose'
            component={purposeFormatter}
          />
          <Column
            header=''
            width={130}
            field='user_id'
            component={ButtonFormatter}
          />
        </TableWithBrowserPagination>
      </Container>
    </>
  );
}

export default AppointmentDashboard;
