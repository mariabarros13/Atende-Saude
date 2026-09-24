import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { NovaSolicitacao } from "../pages/NovaSolicitacao";

describe("Nova Solicitação", () => {
  it("exibe o campo de justificativa quando a prioridade é URGENTE", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <NovaSolicitacao />
      </MemoryRouter>
    );

    expect(
      screen.queryByLabelText(/Justificativa da Prioridade/i)
    ).not.toBeInTheDocument();

    const prioridade = screen.getByLabelText(/Prioridade/i);

    await user.selectOptions(prioridade, "URGENTE");

    expect(
      screen.getByLabelText(/Justificativa da Prioridade/i)
    ).toBeInTheDocument();
  });
});