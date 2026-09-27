'use client'

import { useEffect, useState } from 'react'
import Avatar from '@/components/app/Avatar'
import EmptyState from '@/components/app/EmptyState'
import { useProfile } from '@/components/app/ProfileContext'
import { getMembers, getTeams, orgName, type Member, type Organization, type Team } from '@/lib/kpily'
import { roleLabel } from '@/lib/nav'
import '@/styles/People.css'

type Node = { team: Team; children: Node[] }

/** Nests teams under the team whose leader they report to. */
function buildTree(teams: Team[]): Node[] {
  const nodes = new Map(teams.map((t) => [t.id, { team: t, children: [] as Node[] }]))
  const roots: Node[] = []
  for (const n of nodes.values()) {
    const parent = teams.find((t) => t.id !== n.team.id && t.teamLeader && t.teamLeader === n.team.reportsTo)
    if (parent && parent.reportsTo !== n.team.teamLeader) nodes.get(parent.id)!.children.push(n)
    else roots.push(n)
  }
  return roots
}

function Branch({ node, members }: { node: Node; members: Member[] }) {
  const { team } = node
  const leader = members.find((m) => m.email === team.teamLeader)
  const crew = members.filter((m) => m.team === team.id && m.email !== team.teamLeader)
  return (
    <li>
      <div className="ka-org__node" style={{ '--c': team.color || '#106190' } as React.CSSProperties}>
        <strong>{team.teamName}</strong>
        <Avatar name={leader?.fullname ?? team.teamLeader} src={null} size={40} />
        <span>{leader?.fullname ?? team.teamLeader ?? 'No leader'}</span>
        <small>Team Lead · {crew.length} member{crew.length === 1 ? '' : 's'}</small>
        {crew.length > 0 && <div className="ka-org__members">{crew.slice(0, 8).map((m) => <span key={m.id} title={m.fullname}><Avatar name={m.fullname} src={null} size={26} /></span>)}</div>}
      </div>
      {node.children.length > 0 && <ul>{node.children.map((c) => <Branch key={c.team.id} node={c} members={members} />)}</ul>}
    </li>
  )
}

export default function Organogram() {
  const { profile } = useProfile()
  const [teams, setTeams] = useState<Team[] | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  useEffect(() => {
    getTeams().then(setTeams).catch(() => setTeams([]))
    getMembers().then(setMembers).catch(() => {})
  }, [])

  const org = profile?.organization as Organization | undefined
  const heads = members.filter((m) => m.privilege >= 100)
  const unassigned = members.filter((m) => !m.team && m.privilege < 100)

  return (
    <div className="ka-people">
      <div className="ka-pagehead"><div><h1>Organogram</h1><p>How your teams report to each other</p></div></div>
      <section className="ka-card ka-org">
        {teams === null ? <p className="ka-muted">Loading…</p> : (
          <ul className="ka-org__tree">
            <li>
              <div className="ka-org__node">
                <strong>{orgName(org) || 'Your organisation'}</strong>
                {heads.slice(0, 3).map((m) => <span key={m.id}>{m.fullname} · {roleLabel(m.privilege)}</span>)}
                <small>{members.length} people · {teams.length} team{teams.length === 1 ? '' : 's'}</small>
              </div>
              {(teams.length > 0 || unassigned.length > 0) && (
                <ul>
                  {buildTree(teams).map((n) => <Branch key={n.team.id} node={n} members={members} />)}
                  {unassigned.length > 0 && (
                    <li>
                      <div className="ka-org__node" style={{ '--c': '#9a9a9a' } as React.CSSProperties}>
                        <strong>Not in a team</strong>
                        <div className="ka-org__members">{unassigned.map((m) => <span key={m.id} title={m.fullname}><Avatar name={m.fullname} src={null} size={26} /></span>)}</div>
                        <small>{unassigned.map((m) => m.fullname).join(', ')}</small>
                      </div>
                    </li>
                  )}
                </ul>
              )}
            </li>
          </ul>
        )}
        {teams !== null && !teams.length && !members.length && <EmptyState />}
      </section>
    </div>
  )
}
