package v1

import (
	"github.com/Explaimaus-Hash/GitHub-clone-/internal/context"
	"github.com/Explaimaus-Hash/GitHub-clone-/internal/route/api/v1/types"
)

func listTeams(c *context.APIContext) {
	org := c.Org.Organization
	if err := org.GetTeams(); err != nil {
		c.Error(err, "get teams")
		return
	}

	apiTeams := make([]*types.OrganizationTeam, len(org.Teams))
	for i := range org.Teams {
		apiTeams[i] = toOrganizationTeam(org.Teams[i])
	}
	c.JSONSuccess(apiTeams)
}
