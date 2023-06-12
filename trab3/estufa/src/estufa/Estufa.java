package estufa;

import javax.swing.JOptionPane;
import net.sourceforge.jFuzzyLogic.FIS;
import net.sourceforge.jFuzzyLogic.FunctionBlock;
import net.sourceforge.jFuzzyLogic.Gpr;
import net.sourceforge.jFuzzyLogic.plot.JFuzzyChart;
import net.sourceforge.jFuzzyLogic.rule.Variable;

public class Estufa {

	public static void main(String[] args) throws Exception {
		// Carrega o arquivo .FCL
		String fileName = "trab3/estufa/src/estufa/estufa.fcl";
		FIS fis = FIS.load(fileName, true);
		if (fis == null) { // Erro de arquivo
			System.err.println("Arquivo inexistente: '" + fileName + "'");
			return;
		}

		// Exibir os gráficos de cada regra
		FunctionBlock functionBlock = fis.getFunctionBlock(null);
		JFuzzyChart.get().chart(functionBlock);

		// Pegar os dados de entrada
		String temperatura = JOptionPane.showInputDialog("Qual é a temperatura? (0 a 50)");
		functionBlock.setVariable("temperatura", Integer.parseInt(temperatura));

		String umidade = JOptionPane.showInputDialog("Qual é a umidade? (0 a 100)");
		functionBlock.setVariable("umidade", Integer.parseInt(umidade));

		// Avalia as regras
		functionBlock.evaluate();

		// Mostra o gráfico de conclusões
		Variable litros_agua = functionBlock.getVariable("quantidade_agua");
		JFuzzyChart.get().chart(litros_agua, litros_agua.getDefuzzifier(), true);

		String texto = "Com entrada:\nTemperatura: " + temperatura + "\nUmidade: " + umidade + "\nA saída foi: \n" + Math.round(functionBlock.getVariable("quantidade_agua").getValue()) + " litros";
		JOptionPane.showMessageDialog(null, texto);

	}
}