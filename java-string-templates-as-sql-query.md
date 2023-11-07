---
date: 2023-11-07
---
# Java string templates as SQL query

## String templates

Java 21 with [JEP 430](https://openjdk.org/jeps/430) introduce [preview feature](https://docs.oracle.com/en/java/javase/21/language/preview-language-and-vm-features.html) of `string templates`,
which is advanced version of `string interpolation` commonly known from other languages like JS or Python.

## Examples

Here is simple example how string templates works. 

```java
public class Example {
    
    public String example() {
        String name = "exys666";
        return STR."Hello \{ name }";
    }
}
```

Unfortunately [Prism](https://prismjs.com/) highlighter does not support new Java 21 features yet.

`STR` is `Processor<String, RuntimeException>` static field in `java.lang.StringTemplate` interface.
There is also [FMT](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/FormatProcessor.html#FMT)
and [RAW](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringTemplate.html#RAW),
for more details follow links.

## Idea

There is also option to create own template processor, just implement `java.lang.StringTemplate.Processor<String, RuntimeException>` interface.
Such implementation can also return different type then standard `String` class.

So, I thought why not to create custom template processor which will SQL query. 
Of course string concatenation is very bad idea for creating SQL queries because of [SQL Injection](https://en.wikipedia.org/wiki/SQL_injection).
Proper solution should make use of `java.sql.PreparedStatement`.

## Proof of concept

`StringTemplate.Processor<R,E extends Throwable>` is [@FunctionalInterface](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/FunctionalInterface.html), so it can be used as lambda.
`StringTemplate` interface provides `fragments()` method which return fragments of original template separated by interpolated part.
For example:
```java
String name = "exys";
STR."Hello \{ name }, have a good day";
```
will return:
```java
List.of("Hello ", ", have a good day");
```

`PreparedStatement` accepts SQL query as a `String` with argument passed as `?`,
for example:
```sql
SELECT * WHERE id = ?
```

So, in order to create SQL query out of given template, all we have to do is join fragment using `?`.
```java
import java.sql.*;

public interface Statement {

    static StringTemplate.Processor<PreparedStatement, SQLException> prepare(Connection connection) {
        return (StringTemplate template) -> connection.prepareStatement(String.join("?", template.fragments()));
    }
}
```

Query arguments are passed to `PreparedStatement` using set of dedicated setter methods.
`StringTemplate` interface provides `values()` method which return arguments as `List<Object`.
All we had to do is write switch statement which calls right methods in `PreparedStatement` base on argument type.
```java
import java.sql.*;

public interface Statement {

    static StringTemplate.Processor<PreparedStatement, SQLException> prepare(Connection connection) {
        return (StringTemplate template) -> {
            var statement = connection.prepareStatement(String.join("?", template.fragments()));

            for (int i = 1; i <= template.values().size(); i++) {
                switch (template.values().get(i - 1)) {
                    case Integer x -> statement.setInt(i, x);
                    case String s -> statement.setString(i, s);
                    default -> throw new UnsupportedOperationException();
                }
            }

            return statement;
        };
    }
}
```

So now we can use it like in this:
```java
import java.sql.*;

public class Example {

    public PreparedStatment example(Connection connection) {
        int id = 666;
        return Statement.prepare(connection)."SELECT * WHERE id = \{ id }";
    }
}
```

Of course supporting all setter methods available in `PreparedStatement` will require more work. 
I've created more completed example as java project [here](https://github.com/exys666/statement-template).
