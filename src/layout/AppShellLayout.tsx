import { AppShell, Container } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import Header from "../common/Header"

const Appshell = () => {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default Appshell