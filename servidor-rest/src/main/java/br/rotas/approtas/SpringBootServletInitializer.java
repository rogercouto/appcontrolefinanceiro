package br.rotas.approtas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@EnableAutoConfiguration
@SpringBootApplication
public class SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootServletInitializer.class, args);
	}
	
	@RequestMapping("/home")
	public String home() {
		return "Rest Server Funcionando!";
	}
	
}