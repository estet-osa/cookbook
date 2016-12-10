<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="comments")
 */
class Comments
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Recipe", inversedBy="comments")
     * @ORM\JoinColumn(name="recipe_id", referencedColumnName="id")
     */
    protected $recipe;

    /**
     *  @Assert\Length(
     *      min = 20,
     *      max = 20000,
     *      minMessage = "Минимальное колличество символов описания, должно быть больше чем {{ limit }}.",
     *      maxMessage = "Максимальное колличество символов для описания не должно превышать {{ limit }}."
     * )
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    protected $description;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Comments
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set recipe
     *
     * @param \AppBundle\Entity\Recipe $recipe
     *
     * @return Comments
     */
    public function setRecipe(\AppBundle\Entity\Recipe $recipe = null)
    {
        $this->recipe = $recipe;

        return $this;
    }

    /**
     * Get recipe
     *
     * @return \AppBundle\Entity\Recipe
     */
    public function getRecipe()
    {
        return $this->recipe;
    }
}
