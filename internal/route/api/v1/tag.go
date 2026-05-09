package v1

import "github.com/Explaimaus-Hash/GitHub-clone-/internal/route/api/v1/types"

type tag struct {
	Name   string                      `json:"name"`
	Commit *types.WebhookPayloadCommit `json:"commit"`
}
